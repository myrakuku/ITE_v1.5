"use client"

import Create_Product_Form from "@/components/CreateForm/Create-Product-Form"
import Link from "next/link"

const CreateProductPage = () => {
  return (
    <div>
            <Link href={"/admin/ProductLists"}>
              返回
            </Link>
    <Create_Product_Form/>
    </div>
  )
}

export default CreateProductPage