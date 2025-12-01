"use client";
import { FiArrowLeft } from "react-icons/fi";
import Image from "next/image";
import { useTranslations } from "next-intl";

// import Logo1 from "@/assets/learn_more/1.ajuntament.png";
// import Logo2 from "@/assets/learn_more/2.descoberta-familia.png";
// import Logo3 from "@/assets/learn_more/3.itinerari.png";
// import Logo4 from "@/assets/learn_more/4.web-parcnatural.png";
// import Logo5 from "@/assets/learn_more/5.web-turismegarrotxa.png";

// const links = [
//     {
//         title: "Ajuntament de Castellfollit de la Roca",
//         url: "https://castellfollitdelaroca.cat/",
//         logo: Logo1,
//     },
//     {
//         title: "Descoberta en Família de Castellfollit de la Roca",
//         url: "https://parcsnaturals.gencat.cat/web/.content/Xarxa-de-parcs/garrotxa/coneix-nostra-feina/centre-documentacio/estudis/educacio-ambiental/EM-descoberta-familia/2023/castellfollit-p-acc.pdf",
//         logo: Logo2,
//     },
//     {
//         title: "Itinerari de Castellfollit de la Roca",
//         url: "https://parcsnaturals.gencat.cat/web/.content/Xarxa-de-parcs/garrotxa/gaudeix-parc/equipaments-itineraris/itineraris/a-peu/13.PNZVG-CASTELLFOLLIT-cat.pdf",
//         logo: Logo3,
//     },
//     {
//         title: "Web Parc Natural de la Zona Volcànica de la Garrotxa",
//         url: "https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/garrotxa/inici/index.html",
//         logo: Logo4,
//     },
//     {
//         title: "Web Turisme Garrotxa",
//         url: "https://ca.turismegarrotxa.com/itineraris-i-rutes/la-cinglera-basaltica-de-castellfollit-de-la-roca-22/",
//         logo: Logo5,
//     },
// ];

import pic1 from "../../../public/history/1..jpg";
import pic2 from "../../../public/history/2.jpg";
import pic3 from "../../../public/history/3.jpg";
import pic4 from "../../../public/history/4.jpg";
import pic5 from "../../../public/history/5.jpg";
import pic6 from "../../../public/history/6.jpg";
import pic7 from "../../../public/history/7.jpg";
import pic8 from "../../../public/history/8.jpg";
import pic9 from "../../../public/history/9.jpg";
import pic10 from "../../../public/history/10.jpg";
import pic11 from "../../../public/history/11.jpg";
import pic12 from "../../../public/history/12.jpg";
import pic13 from "../../../public/history/13.jpg";
import pic14 from "../../../public/history/14.jpg";

const images = [
  { id: 1, image: pic1 },
  { id: 2, image: pic2 },
  { id: 3, image: pic3 },
  { id: 4, image: pic4 },
  { id: 5, image: pic5 },
  { id: 6, image: pic6 },
  { id: 7, image: pic7 },
  { id: 8, image: pic8 },
  { id: 9, image: pic9 },
  { id: 10, image: pic10 },
  { id: 11, image: pic11 },
  { id: 12, image: pic12 },
  { id: 13, image: pic13 },
  { id: 14, image: pic14 },
];

const SplashPopUp = ({ handleClose }: { handleClose: () => void }) => {
  const t = useTranslations("Dashboard");

  return (
    <div className="fixed inset-0 p-2 flex items-center justify-center bg-black/50 z-50">
      <div className="relative w-full max-w-md bg-[#F5F3ED] rounded-2xl shadow-2xl p-3 overflow-y-scroll max-h-[85vh]">
        <div className="flex  gap-3 p-4 ">
          <button onClick={handleClose} className="p-1">
            <FiArrowLeft size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map(({ id, image }) => (
              <div
                key={id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={image}
                    alt={`Historical image ${id}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-600">{t(`pic${id}`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPopUp;
