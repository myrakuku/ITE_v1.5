"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

const ERBListsPage = () => {

    const [GetERBDataLists , setGetERBDataLists] = useState([]);
    
    useEffect(() => { 
    const fetchNITTPDataLists = async () => {
        const response = await fetch("/api/ERB/Get_ERB_Lists");
        const data = await response.json();
        setGetERBDataLists(data);
        };
    fetchNITTPDataLists();
    }, []);

    console.log("GetERBDataLists : ", GetERBDataLists , "-- End --")

  return (
    <div>
      <Link href={"/admin/DataLists/ERBLists/CreateERB"}>
            建立ERB課程
      </Link>
      <h1>ERBListsPage</h1>
    </div>
  )
}

export default ERBListsPage