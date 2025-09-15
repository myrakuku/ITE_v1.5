"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

const NITTPListsPage = () => {

    const [GetNITTPDataLists , setGetNITTPDataLists] = useState([]);
    
    useEffect(() => { 
    const fetchNITTPDataLists = async () => {
        const response = await fetch("/api/NITTP/Get_NITTP_Lists");
        const data = await response.json();
        setGetNITTPDataLists(data);
        };
    fetchNITTPDataLists();
    }, []);

    console.log("GetNITTPDataLists : ",GetNITTPDataLists ,"-- End --")

    return (
        <>
        <Link href={"/admin/DataLists/NITTPLists/CreateNITTP"}>
            建立NITTP課程
        </Link>
            NITTPListsPage
        </>
    )
}

export default NITTPListsPage