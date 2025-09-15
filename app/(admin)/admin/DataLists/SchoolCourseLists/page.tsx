"use client"

import Link from "next/link";
import { useEffect, useState } from "react"

const SchoolCourseListsPage = () => {

    const [GetHomemadeData , setGetuserDataLists] = useState([]);

    useEffect(() => { 

        const fetchHomemadeDataLists = async () => {
          const response = await fetch("/api/Homemade/Get_Homemade_Lists");
          const data = await response.json();
          setGetuserDataLists(data);
        };
        fetchHomemadeDataLists();
    }, []);

    console.log("GetHomemadeData : ", GetHomemadeData,"-- End --")

    return(
        <>  
        <div>
            <Link href={"/admin/DataLists/SchoolCourseLists/CreateHomemadeCourse"}>
                建立自家課程
            </Link>
        </div>
        SchoolListsPage

        

        </>
    )
}

export default SchoolCourseListsPage