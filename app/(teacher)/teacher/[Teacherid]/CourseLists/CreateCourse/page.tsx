"use client";


import CreateCourseTeacherForm from "@/components/CreateForm/Create-CourseTeacher-Form";
import Link from "next/link";
import { useParams } from "next/navigation";

const CreateCoursePage = () => {
      const params = useParams();
    
      console.log("params : ", params);
    
      const TeacherId = params.Teacherid as string;
  return (
    

          <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">

          <Link
            href={`/teacher/${TeacherId}/CourseLists`}
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
          >
            返回
          </Link>
        </div>
        <CreateCourseTeacherForm />
      </div>
    </div>
      

    
  )
}

export default CreateCoursePage