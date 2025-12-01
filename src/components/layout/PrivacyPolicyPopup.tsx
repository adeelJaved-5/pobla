"use client";
import { useTranslations } from "next-intl";
import { FiArrowLeft } from "react-icons/fi";

const PrivacyPolicyPopup = ({ handleClose }: { handleClose: () => void }) => {
    const t = useTranslations("privacyPolicy");
    return (
        <div className="fixed inset-0 p-2 flex items-center justify-center bg-black/50 z-50">
            <div className="relative w-full max-w-lg bg-[#F5F3ED] rounded-2xl shadow-2xl p-4 overflow-y-scroll max-h-[85vh]">

                {/* Close Button */}
                <div className="flex gap-3 mb-4">
                    <button onClick={handleClose} className="p-1">
                        <FiArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800">{t("title")}</h1>
                </div>

                {/* Privacy Policy Content */}
                <div className="space-y-4 text-gray-800 text-sm">
                    <section>
                        <h2 className="font-medium text-gray-900">{t("sections.responsible.title")}</h2>
                        <p>{t("sections.responsible.content")}
                        </p>
                        <ul className="list-disc list-inside">
                            <li>{t("sections.responsible.items.0")}</li>
                            <li>{t("sections.responsible.items.1")}</li>
                            <li>{t("sections.responsible.items.2")}</li>
                            <li>{t("sections.responsible.items.3")}</li>
                            <li>{t("sections.responsible.items.4")}</li>
                            <li>{t("sections.responsible.items.5")}</li>
                            <li>{t("sections.responsible.items.6")}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-medium text-gray-900">{t("sections.dataCollected.title")}</h2>
                        <p>{t("sections.dataCollected.content")}
                        </p>
                        <ul className="list-disc list-inside">
                            <li>{t("sections.dataCollected.items.0")}</li>
                            <li>{t("sections.dataCollected.items.1")}</li>
                            <li>{t("sections.dataCollected.items.2")}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-medium text-gray-900">{t("sections.purpose.title")}</h2>
                        <p>{t("sections.purpose.content")}
                        </p>
                        <ul className="list-disc list-inside">
                            <li>{t("sections.purpose.items.0")}</li>
                            <li>{t("sections.purpose.items.1")}</li>
                            <li>{t("sections.purpose.items.2")}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-medium text-gray-900">{t("sections.legalBasis.title")}</h2>
                        <p>{t("sections.legalBasis.content")}
                        </p>
                    </section>

                    <section>
                        <h2 className="font-medium text-gray-900">{t("sections.dataRetention.title")}</h2>
                        <p>{t("sections.dataRetention.content")}
                        </p>
                    </section>

                    <section>
                        <h2 className="font-medium text-gray-900">{t("sections.dataSharing.title")}</h2>
                        <p>{t("sections.dataSharing.content")}
                        </p>
                    </section>

                    <section>
                        <h2 className="font-medium text-gray-900">{t("sections.userRights.title")}</h2>
                        <p>{t("sections.userRights.content")}
                        </p>
                    </section>

                    <section>
                        <h2 className="font-medium text-gray-900">{t("sections.effect.title")}</h2>
                        <p>{t("sections.effect.content")}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPopup;