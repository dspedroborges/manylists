"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";

export default function Page() {
    const [urls, setUrls] = useState<{ title: string, url: string, progress: number, lastUpdate: string }[]>([]);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        let lsUrls = JSON.parse(localStorage.getItem("urls") || "[]");
        console.log(lsUrls)
        setUrls(lsUrls);
    }, []);

    const removeUrl = (title: string) => {
        let lsUrls = JSON.parse(localStorage.getItem("urls") || "[]");
        let index = -1;
        for (let i = 0; i < urls.length; i++) {
            if (urls[i].title === title) {
                index = i;
                break;
            }
        }

        if (index === -1) return;

        lsUrls.splice(index, 1);
        localStorage.setItem("urls", JSON.stringify(lsUrls));
        location.reload();
    }

    return (
        <main>
            <div className="text-white flex flex-col items-center justify-center min-h-screen text-2xl gap-4">
                {
                    urls.map((u, i) => {
                        return (
                            <div key={i} className="group flex items-center gap-8">
                                <Link className="hover:scale-90 flex items-center gap-4" href={u.url} key={i}>
                                    {u.title}
                                    <span className="text-xs rounded-full flex items-center justify-center bg-blue-600 text-white p-2">{u.lastUpdate}</span>
                                </Link>
                                {
                                    showDelete ? (
                                        <BsTrash className="hover:scale-90 cursor-pointer text-red-500 text-base opacity-0 group-hover:opacity-100" onClick={() => removeUrl(u.title)} />
                                    ) : (
                                        <BsTrash className="hover:scale-90 cursor-pointer text-base opacity-0 group-hover:opacity-100" onClick={() => {
                                            setShowDelete(true);
                                            setTimeout(() => {
                                                setShowDelete(false);
                                            }, 2000);
                                        } }/>
                                    )
                                }
                            </div>
                        )
                    })
                }
            </div>
        </main>
    )
}