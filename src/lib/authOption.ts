import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.addresses.read"
        }
      }
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: "common",
      authorization: {
        params: {
          scope: "openid profile email User.Read People.Read User.Read.All",
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const usersCol = await getCollection("users");
        if (!usersCol) return null;

        const user = await usersCol.findOne({ email: credentials.email });
        if (!user) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.origin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      const usersCol = await getCollection("users");

      let dbUser = null;

      if (account) {
        token.accessToken = account.access_token;

        if (account.provider === "google") {
          try {
            const res = await fetch(
              "https://people.googleapis.com/v1/people/me?personFields=names,phoneNumbers,addresses,emailAddresses",
              {
                headers: { Authorization: `Bearer ${account.access_token}` },
              }
            );
            const profile = await res.json();

            token.phone = profile.phoneNumbers?.[0]?.canonicalForm || "";
            token.address = profile.addresses?.[0]?.formattedValue || "";
            token.firstName = profile.names?.[0]?.givenName || "";
            token.lastName = profile.names?.[0]?.familyName || "";
            token.email = profile.emailAddresses?.[0]?.value || "";
          } catch (err) {
            console.error("Google People API error:", err);
          }
        }

        if (account.provider === "azure-ad") {
          try {
            const res = await fetch("https://graph.microsoft.com/v1.0/me", {
              headers: { Authorization: `Bearer ${account.access_token}` },
            });
            const profile = await res.json();
            token.sub = profile.id;
            token.firstName = profile.givenName || "";
            token.lastName = profile.surname || "";
            token.email = profile.mail || profile.userPrincipalName || "";
            token.phone = profile.mobilePhone || profile.businessPhones?.[0] || "";
            token.address = profile.officeLocation || "";
          } catch (err) {
            console.error("Microsoft Graph API error:", err);
          }
        }
        dbUser = await usersCol?.findOne({ email: token.email });
        token.phone = token.phone || dbUser?.phone || "";
        token.address = token.address || dbUser?.origin || "";
        try {
          if (!dbUser) {
            await usersCol?.insertOne({
              email: token.email,
              password: token.sub || "",
              firstName: token.firstName,
              lastName: token.lastName,
              phone: token.phone,
              origin: token.address,
              verificationCode: null,
              verificationExpires: null,
              isVerified: true,
              hasSeenPopup: false,
              points: 0,
              currentLevel: 1,
              POIsCompleted: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          } else {
            const updates: any = {};
            if (!dbUser.firstName && token.firstName) updates.firstName = token.firstName;
            if (!dbUser.lastName && token.lastName) updates.lastName = token.lastName;
            if (!dbUser.phone && token.phone) updates.phone = token.phone;
            if (!dbUser.origin && token.address) updates.origin = token.address;

            if (Object.keys(updates).length > 0) {
              await usersCol?.updateOne({ _id: new ObjectId(dbUser._id) }, { $set: updates });
            }
          }
        } catch (err) {
          console.error("SignIn DB error:", err);
        }
      }
      if (user) {
        const u = user as any;
        token.id = u.id;
        token.firstName = u.firstName;
        token.lastName = u.lastName;
        token.phone = u.phone;
        token.address = u.address;
        token.email = u.email;
      }

      return token;
    },

    async session({ session, token }) {

      const usersCol = await getCollection("users");

      if (session.user) {
        const dbUser = await usersCol?.findOne({ email: session.user.email });

        if (dbUser) {
          (session.user as any).id = dbUser._id;
          (session.user as any).phone = dbUser.phone || token.phone || "";
          (session.user as any).address = dbUser.origin || token.address || "";
          (session.user as any).firstName = dbUser.firstName || token.firstName || "";
          (session.user as any).lastName = dbUser.lastName || token.lastName || "";
        } else {
          (session.user as any).id = token.sub || "";
          (session.user as any).phone = token.phone || "";
          (session.user as any).address = token.address || "";
          (session.user as any).firstName = token.firstName || "";
          (session.user as any).lastName = token.lastName || "";
        }

        (session.user as any).missingInfo =
          !(session.user as any).phone || !(session.user as any).address;
      }

      return session;
    }
  },
};
