"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { BsCaretLeftFill, BsCaretRightFill, BsCheckCircleFill, BsDiscFill, BsFloppy, BsPlusCircle, BsTrash } from "react-icons/bs";
import { Gloria_Hallelujah } from "next/font/google";

const gloriaHallelujah = Gloria_Hallelujah({ weight: ["400"], subsets: ["latin"] });

export default function Home() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  )
}

type InfoType = { title: string, color: string, items: string[] };

const objToString = (obj: InfoType[]) => {
  let stringArray = obj.map((o) => {
    return `${o.title}-${o.color}@${o.items.join(";")}`;
  });

  return stringArray.join(">>");
}

const saveURL = (title: string, url: string) => {
  let urls = JSON.parse(localStorage.getItem("urls") || "[]");
  let index = -1;
  for (let i = 0; i < urls.length; i++) {
    if (urls[i].title === title) {
      index = i;
      break;
    }
  }

  if (index !== -1) {
    urls[index] = { ...urls[index], url, lastUpdate: new Date().toLocaleDateString() };
  } else {
    urls.push({
      title,
      url,
      lastUpdate: new Date().toLocaleDateString()
    });
  }

  if (title !== "null" && title !== "Change the title") {
    localStorage.setItem("urls", JSON.stringify(urls));
  }
}

function Page() {
  const searchParams = useSearchParams();
  let title = searchParams.get("title");
  let content = searchParams.get("content");
  const [currentTitle, setCurrentTitle] = useState(title || "Change the title");
  const [info, setInfo] = useState<InfoType[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();
  
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const pushToUrlAndSave = () => {
    router.push(`?title=${currentTitle}&content=${objToString(info)}`);
    saveURL(currentTitle, window.location.origin + `/?title=${currentTitle}&content=${objToString(info)}`);
  }

  useEffect(() => {
    if (content) {
      let elements = [];
      let contentsString = content.split(">>");
      for (let i = 0; i < contentsString.length; i++) {
        const [titleAndColor, content] = contentsString[i].split("@");
        const [title, color] = titleAndColor.split("-");
        const items = content?.split(";") || [];
        elements.push({
          title,
          color,
          items
        })
      }

      setInfo(elements);
    }
  }, [content]);

  const handleAddList = (formData: FormData) => {
    const title = formData.get("title") as string;
    const color = "dodgerblue";
    setInfo([...info, { title, color, items: [] }]);
  }

  return (
    <main className="min-h-screen py-8 pb-16 px-16">
      <input type="text" className={`bg-transparent text-white text-center rounded-xl text-xl lg:text-6xl mx-auto block ${gloriaHallelujah.className}`} value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} />
      <form action={handleAddList} className="flex flex-col lg:flex-row items-center p-4 gap-4">
        <input type="text" name="title" className="border h-12 p-2 w-full rounded-xl bg-transparent focus:outline-none text-white" placeholder="List title here" />
        <button className="h-12 hover:scale-90">
          <BsPlusCircle className="text-4xl text-white" />
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 select-none py-10">
        {
          info.map((list, i) => {
            return (
              <div key={generateId()} style={{ background: list.color }} className="text-gray-100 p-4 rounded-xl relative group border">
                <input type="text" defaultValue={list.title} className="text-2xl font-extralight mb-4 bg-transparent w-full p-2" onBlur={(e) => {
                  let copy = JSON.parse(JSON.stringify(info));
                  copy[i].title = e.target.value;
                  setInfo(copy);
                }} />
                <span className="border bg-gray-800 p-2 rounded-xl opacity-0 group-hover:opacity-100 absolute top-0 -right-12 grid grid-cols-1 gap-4 z-50">
                  {
                    showDelete ? (
                      <BsTrash className="text-2xl text-red-400 hover:scale-90 cursor-pointer" onClick={() => {
                        let copy = JSON.parse(JSON.stringify(info));
                        copy.splice(i, 1);
                        setInfo(copy);
                      }} />
                    ) : (
                      <BsTrash className="text-2xl hover:scale-90 cursor-pointer" onClick={() => {
                        setShowDelete(true);
                        setTimeout(() => {
                          setShowDelete(false);
                        }, 2000);
                      }} />
                    )
                  }
                  <ColorPicker defaultValue={list.color} onBlur={(selectedColor: string) => {
                    let copy = JSON.parse(JSON.stringify(info));
                    console.log(selectedColor);
                    copy[i].color = selectedColor.replaceAll("#", "");
                    setInfo(copy);
                  }} />
                </span>
                <textarea name={`${i}`} id={`${i}`} className="w-full bg-transparent min-h-52 p-2" defaultValue={list.items.join("\n")} onBlur={(e) => {
                  let copy = JSON.parse(JSON.stringify(info));
                  copy[i].items = e.target.value.split("\n");
                  setInfo(copy);
                }}></textarea>
                <div className="flex justify-between text-white mt-2 opacity-0 group-hover:opacity-100">
                  <BsCaretLeftFill className="text-2xl cursor-pointer hover:scale-90" onClick={() => {
                    let copy = JSON.parse(JSON.stringify(info));
                    if (i - 1 >= 0) {
                      let tmp = copy[i - 1];
                      copy[i - 1] = copy[i];
                      copy[i] = tmp;
                      console.log(copy);
                    }
                    setInfo(copy);
                  }} />
                  <BsCaretRightFill className="text-2xl cursor-pointer hover:scale-90" onClick={() => {
                    let copy = JSON.parse(JSON.stringify(info));
                    if (i + 1 <= info.length - 1) {
                      let tmp = copy[i + 1];
                      copy[i + 1] = copy[i];
                      copy[i] = tmp;
                    }
                    setInfo(copy);
                  }} />
                </div>
              </div>
            )
          })
        }
      </div>

      {
        !isSaved ? (
          <BsFloppy className="bg-black p-2 rounded-xl text-white fixed bottom-2 right-2 text-4xl hover:scale-90 cursor-pointer" onClick={() => {
            pushToUrlAndSave();
            setIsSaved(true);
            setTimeout(() => {
              setIsSaved(false);
            }, 2000);
          }} />
        ) : (
          <BsCheckCircleFill className="bg-black p-2 rounded-xl text-white fixed bottom-2 right-2 text-4xl hover:scale-90 cursor-pointer animate-bounce" onClick={() => pushToUrlAndSave()} />
        )
      }
    </main>
  )
}

function ColorPicker({ defaultValue, onBlur }: { defaultValue?: string, onBlur?: Function }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(defaultValue);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (inputRef.current) {
      inputRef.current.value = color;
    }
  };

  useEffect(() => {
    if (selectedColor !== defaultValue && onBlur) {
      onBlur(selectedColor);
    }
  }, [selectedColor, defaultValue, onBlur]);

  const colors = ["indigo", "darkred", "darkgreen", "dodgerblue", "darkblue", "saddlebrown", "grey", "black"];

  return (
    <div className="flex flex-col">
      {/* <label className="font-bold cursor-pointer" htmlFor="color">
        Color:
      </label> */}
      <input
        ref={inputRef}
        type="text"
        name="color"
        id="color"
        className="hidden"
        defaultValue={defaultValue}
      />
      <div className="grid grid-cols-1 gap-2 justify-items-center">
        {colors.map((color) => (
          <span
            key={color}
            className={`hover:scale-110 cursor-pointer w-4 h-4 ${selectedColor === color ? "border-2" : ""
              }`}
            style={{ background: color }}
            onClick={() => handleColorChange(color)}
          ></span>
        ))}
      </div>
    </div>
  );
}