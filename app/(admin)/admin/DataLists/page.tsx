"use client"

import Link from "next/link"

const DataListsPage = () => {
    return (
        <>
            <div>
                <Link href={"/admin/DataLists/SchoolCourseLists"} >
                    自家課程列表
                </Link>
            </div>
            <div>
                <Link href={"/admin/DataLists/NITTPLists"} >
                    NITTP課程列表
                </Link>
            </div>
            <div>
                <Link href={"/admin/DataLists/ERBLists"} >
                    ERB課程列表
                </Link>
            </div>
        </>
    )
}

export default DataListsPage