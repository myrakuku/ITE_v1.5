"use client"

import EditCourseTeacherForm from "@/components/EditForm/Edit-TeacherCourse-Form"
import Link from "next/link"
import { useParams } from "next/navigation";

const EditCoursePage = () => {
 const params = useParams();
  
    console.log("params : ", params);
  
    const TeacherId = params.Teacherid as string;
    const courseId = params.CourseId as string;

  return (
    <div>
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">

          <Link
            href={`/teacher/${TeacherId}/CourseLists/${courseId}`}
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
          >
            返回
          </Link>
        </div>
        <EditCourseTeacherForm/>
      </div>
    </div>


      
    </div>
  )
}

export default EditCoursePage