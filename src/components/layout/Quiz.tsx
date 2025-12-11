"use client";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import CustomButton from "../ui/Button";
import { useParams, useRouter } from "next/navigation";
import finding_1 from "@/assets/finding1.png";
import finding_2 from "@/assets/finding2.png";
import finding_3 from "@/assets/finding3.png";
import finding_4 from "@/assets/finding4.png";
import finding_5 from "@/assets/finding5.png";
import finding_6 from "@/assets/finding6.png";
import finding_7 from "@/assets/finding7.png";
import finding_8 from "@/assets/finding8.png";
import finding_9 from "@/assets/finding9.png";
import finding_10 from "@/assets/finding10.png";
import finding_11 from "@/assets/finding11.png";
import finding_12 from "@/assets/finding12.png";
import api from "@/lib/axios";
import { useUser } from "@/context/UserContext";

const Quiz = () => {
  const { user, refreshUser } = useUser();
  const t = useTranslations();
  const t1 = useTranslations("QuizPage");
  const router = useRouter();
  const { id } = useParams();
  const volcanoId = Number(id);
  const findingImages = [
    finding_1,
    finding_2,
    finding_3,
    finding_4,
    finding_5,
    finding_6,
    finding_7,
    finding_8,
    finding_9,
    finding_10,
    finding_11,
    finding_12,
  ];

  const findingNames = [
    t1("finding_1"),
    t1("finding_2"),
    t1("finding_3"),
    t1("finding_4"),
    t1("finding_5"),
    t1("finding_6"),
    t1("finding_7"),
    t1("finding_8"),
    t1("finding_9"),
    t1("finding_10"),
    t1("finding_11"),
    t1("finding_12"),
  ];

  const isQuizPOI = [3, 6, 9, 12].includes(volcanoId);
  const [showFinding, setShowFinding] = useState(false);

  const handleContinue = async () => {
    try {
      await api.post("/poi-completed", {
        poiCompleted: volcanoId,
      });
      refreshUser();
      router.push("/");
    } catch (err: any) {
      console.error("Failed to update:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (!user) return;
    const POICompleted = parseInt(user?.POIsCompleted ?? 0);

    if (!isQuizPOI && POICompleted >= volcanoId) {
      router.push("/");
    } else if (isQuizPOI && POICompleted >= volcanoId) {
      router.push("/");
    } else if (!isQuizPOI) {
      setShowFinding(true);
    }
  }, [volcanoId, router, user, isQuizPOI]);

  const volcanoQuestions = useMemo(
    () => ({
      3: [
        {
          title: t("Volcano3Quiz1.title"),
          options: [
            t("Volcano3Quiz1.option1"),
            t("Volcano3Quiz1.option2"),
            t("Volcano3Quiz1.option3"),
            t("Volcano3Quiz1.option4"),
          ],
          correct: t("Volcano3Quiz1.option1"),
        },
        {
          title: t("Volcano3Quiz2.title"),
          options: [
            t("Volcano3Quiz2.option1"),
            t("Volcano3Quiz2.option2"),
            t("Volcano3Quiz2.option3"),
            t("Volcano3Quiz2.option4"),
          ],
          correct: t("Volcano3Quiz2.option1"),
        },
        {
          title: t("Volcano3Quiz3.title"),
          options: [
            t("Volcano3Quiz3.option1"),
            t("Volcano3Quiz3.option2"),
            t("Volcano3Quiz3.option3"),
            t("Volcano3Quiz3.option4"),
          ],
          correct: t("Volcano3Quiz3.option1"),
        },
      ],
      6: [
        {
          title: t("Volcano6Quiz1.title"),
          options: [
            t("Volcano6Quiz1.option1"),
            t("Volcano6Quiz1.option2"),
            t("Volcano6Quiz1.option3"),
            t("Volcano6Quiz1.option4"),
          ],
          correct: t("Volcano6Quiz1.option1"),
        },
        {
          title: t("Volcano6Quiz2.title"),
          options: [
            t("Volcano6Quiz2.option1"),
            t("Volcano6Quiz2.option2"),
            t("Volcano6Quiz2.option3"),
            t("Volcano6Quiz2.option4"),
          ],
          correct: t("Volcano6Quiz2.option1"),
        },
        {
          title: t("Volcano6Quiz3.title"),
          options: [
            t("Volcano6Quiz3.option1"),
            t("Volcano6Quiz3.option2"),
            t("Volcano6Quiz3.option3"),
            t("Volcano6Quiz3.option4"),
          ],
          correct: t("Volcano6Quiz3.option1"),
        },
      ],
      9: [
        {
          title: t("Volcano9Quiz1.title"),
          options: [
            t("Volcano9Quiz1.option1"),
            t("Volcano9Quiz1.option2"),
            t("Volcano9Quiz1.option3"),
            t("Volcano9Quiz1.option4"),
          ],
          correct: t("Volcano9Quiz1.option1"),
        },
        {
          title: t("Volcano9Quiz2.title"),
          options: [
            t("Volcano9Quiz2.option1"),
            t("Volcano9Quiz2.option2"),
            t("Volcano9Quiz2.option3"),
            t("Volcano9Quiz2.option4"),
          ],
          correct: t("Volcano9Quiz2.option1"),
        },
        {
          title: t("Volcano9Quiz3.title"),
          options: [
            t("Volcano9Quiz3.option1"),
            t("Volcano9Quiz3.option2"),
            t("Volcano9Quiz3.option3"),
            t("Volcano9Quiz3.option4"),
          ],
          correct: t("Volcano9Quiz3.option1"),
        },
      ],
      12: [
        {
          title: t("Volcano12Quiz1.title"),
          options: [
            t("Volcano12Quiz1.option1"),
            t("Volcano12Quiz1.option2"),
            t("Volcano12Quiz1.option3"),
            t("Volcano12Quiz1.option4"),
          ],
          correct: t("Volcano12Quiz1.option1"),
        },
        {
          title: t("Volcano12Quiz2.title"),
          options: [
            t("Volcano12Quiz2.option1"),
            t("Volcano12Quiz2.option2"),
            t("Volcano12Quiz2.option3"),
            t("Volcano12Quiz2.option4"),
          ],
          correct: t("Volcano12Quiz2.option1"),
        },
        {
          title: t("Volcano12Quiz3.title"),
          options: [
            t("Volcano12Quiz3.option1"),
            t("Volcano12Quiz3.option2"),
            t("Volcano12Quiz3.option3"),
            t("Volcano12Quiz3.option4"),
          ],
          correct: t("Volcano12Quiz3.option1"),
        },
      ],
    }),
    [t]
  );

  const allQuestions =
    volcanoQuestions[volcanoId as keyof typeof volcanoQuestions] || [];

  const labels = ["A", "B", "C", "D"];
  const [texts, setTexts] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);

  function shuffleArray(array: any[]) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  const handleSelect = (optionText: string) => {
    setSelected(optionText);

    if (optionText === selectedQuestion.correct) {
      setTimeout(() => {
        setQuizCompleted(true);
      }, 800);
    } else {
      setTimeout(() => {
        setShowPlayAgain(true);
      }, 1000);
    }
  };

  const handlePlayAgain = () => {
    if (selectedQuestion) {
      setTexts(shuffleArray(selectedQuestion.options));
    }
    setSelected(null);
    setShowPlayAgain(false);
  };

  const getOptionClass = (optionText: string) => {
    if (!selected)
      return "bg-[#F5F2F8] border-[#B6B3B9] text-lightblack font-bold";

    if (
      selected === selectedQuestion.correct &&
      optionText === selectedQuestion.correct
    ) {
      return "bg-[#4EB100] border-[#1C3819] text-white font-bold";
    }

    if (selected !== selectedQuestion.correct) {
      if (optionText === selected)
        return "bg-[#FF0000] border-[#550A02] text-white font-bold";
      if (optionText === selectedQuestion.correct)
        return "bg-[#4EB100] border-[#1C3819] text-white font-bold";
    }

    return "bg-[#F5F2F8] border-[#B6B3B9] text-lightblack font-bold";
  };

  useEffect(() => {
    if (allQuestions.length > 0) {
      const randomQ =
        allQuestions[Math.floor(Math.random() * allQuestions.length)];
      setSelectedQuestion(randomQ);
      setTexts(shuffleArray(randomQ.options));
    }
  }, [allQuestions]);

  useEffect(() => {
    if (quizCompleted) {
      const storeQuizStatus = async () => {
        try {
          await api.post("/poi-completed", {
            poiCompleted: volcanoId,
          });
        } catch (err: any) {
          console.error("Failed to update:", err.response?.data || err.message);
        }
      };
      storeQuizStatus();
    }
  }, [quizCompleted, volcanoId]);

  if (showFinding) {
    return (
      <div className="flex flex-col justify-center px-5 h-[90vh] items-center">
        {findingImages[volcanoId - 1] && (
          <div
            className="rounded-2xl h-[362px] w-[362px] mb-4 flex justify-center items-center gradient2-bg"

            // style={{
            //   backgroundImage: "url(/bg.svg)",
            //   backgroundSize: "cover",
            //   backgroundColor: "bg-gradient-to-b from-[#123C62] to-[#257AC8]"
            // }}
          >
            <img
              src={findingImages[volcanoId - 1].src}
              alt={`Finding for Volcano ${volcanoId}`}
              className="w-[65%]"
            />
          </div>
        )}
        <h1 className="text-xl font-bold text-lightblack mb-12 text-center">
          {findingNames[volcanoId - 1]}
        </h1>
        <CustomButton onClick={handleContinue}>{t1("button")}</CustomButton>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="flex flex-col justify-center px-5 h-[90vh] items-center">
        {findingImages[volcanoId - 1] && (
          <div
            className="rounded-2xl h-[362px] w-[362px] mb-4 flex justify-center items-center gradient2-bg"
            // style={{
            //   backgroundImage: "url(/bg.svg)",
            //   backgroundSize: "cover",
            // }}
          >
            <img
              src={findingImages[volcanoId - 1].src}
              alt={`Finding for Volcano ${volcanoId}`}
              className="w-[65%]"
            />
          </div>
        )}
        <h1 className="text-xl font-bold text-lightblack mb-12 text-center">
          {findingNames[volcanoId - 1]}
        </h1>
        <CustomButton onClick={handleContinue}>
          {volcanoId === 12 ? t1("button") : t1("button")}
        </CustomButton>
      </div>
    );
  }

  if (isQuizPOI && allQuestions.length === 0) {
    return <p className="text-center mt-10">No quiz found for this volcano.</p>;
  }

  return (
    <div className="flex flex-col justify-center items-center pb-[95px] bg-white h-[100vh]">
      <div className="bg-white w-full flex h-[242px] mt-[60px] items-center justify-center">
        <h1 className="text-4xl font-bold text-blue text-center px-[38px]">
          {selectedQuestion?.title}
        </h1>
      </div>
      <div className="flex flex-col gap-4 mt-[60px] px-4 w-full">
        {labels.map((label, index) => (
          <div
            key={index}
            onClick={() => !selected && handleSelect(texts[index])}
            className={`min-h-[56px] rounded-[36px] border-2 px-4 py-3 flex items-center gap-4 cursor-pointer transition-colors duration-300 ${getOptionClass(
              texts[index]
            )}`}
          >
            <div
              className={`font-bold flex items-center justify-center
    ${
      !selected
        ? "text-blue"
        : selected === selectedQuestion.correct
        ? texts[index] === selected
          ? "text-white"
          : "text-blue"
        : texts[index] === selected || texts[index] === selectedQuestion.correct
        ? "text-white"
        : "text-blue"
    }
  `}
            >
              {label}
            </div>
            <h1 className="text-sm">{texts[index]}</h1>
          </div>
        ))}
      </div>
      <div className="px-5 w-full">
        {showPlayAgain && (
          <CustomButton onClick={handlePlayAgain} className="mt-6 w-full">
            {t1("try_again")}
          </CustomButton>
        )}
      </div>
    </div>
  );
};

export default Quiz;
