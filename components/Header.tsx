"use client";
import { CATEGORY_MAP } from "@/data/category";
import Link from "next/link";
import { useState } from "react";

export default function Header() {

    const [isFocus, setIsFocus] = useState<boolean>(false);

    return (
        <header>
            <div>
                <ul>
                    <li> <Link href="/">홈</Link></li>
                    {Object.entries(CATEGORY_MAP).map(([key,c])=>
                    <li key={key} onClick={()=> setIsFocus(true)} className={isFocus ? "on" : ""}>
                        <Link href={`/${key}`}>{c.title}</Link>
                    </li>)}
                </ul>
            </div>
        </header>
    )
}