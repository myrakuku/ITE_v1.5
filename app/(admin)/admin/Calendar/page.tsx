"use client"

import { useEffect, useState } from "react"
// import FullCalendar from "@fullcalendar/react";

const CalendarPage = () => {

    const [ GetCourseData , setCourseData ] = useState([]);
    const [ GetTeacherData , setGetTeacherData ] = useState([]);

    useEffect(() => {
        const  fetchCourseData = async () => {
            const response = await fetch("/api/Course/Get_Course_Lists");
            const data = await response.json();
            setCourseData(data);
        }
        

        const fetchTeacherData = async () => {
            const response = await fetch("/api/user/Get_User_Lists");
            const data = await response.json();
            setGetTeacherData(data);
        }

        fetchTeacherData();
        fetchCourseData();

    }, []);

    console.log("GetCourseData : ",GetCourseData,"-- End --")
    console.log("GetTeacherData : ",GetTeacherData,"-- End --")

    return (
        <>
            CalendarPage
        </>
    )   
} 

export default CalendarPage