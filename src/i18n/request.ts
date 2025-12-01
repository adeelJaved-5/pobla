// import {getRequestConfig} from 'next-intl/server';
 
// export default getRequestConfig(async () => {
//   // Provide a static locale, fetch a user setting,
//   // read from `cookies()`, `headers()`, etc.
//   const locale = 'en';
 
//   return {
//     locale,
//     messages: (await import(`../../messages/${locale}.json`)).default
//   };
// });

// i18n/request.ts

import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const locale = (await cookieStore).get('NEXT_LOCALE')?.value || 'ca';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
