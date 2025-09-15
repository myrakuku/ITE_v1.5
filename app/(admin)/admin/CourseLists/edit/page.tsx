"use client";

import Edit_Course_Form_Calendar from "@/components/EditForm/Edit-AdminCourse-Form-Calendar";
import Link from "next/link";

const EditCoursePage = () => {
  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin/CourseLists"
          className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 inline-block mb-6"
        >
          返回
        </Link>
        <Edit_Course_Form_Calendar />
      </div>
    </div>
  );
};

export default EditCoursePage;