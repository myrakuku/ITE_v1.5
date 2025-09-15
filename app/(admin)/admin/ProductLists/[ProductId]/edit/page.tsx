"use client";

import EditProductForm from "@/components/EditForm/Edit-AdminProduct-Form";
import Link from "next/link";
import { useParams } from "next/navigation";

const EditProductPage = () => {
  const params = useParams();
  const ProductId = params.ProductId as string;

  return (
    <>
      <p>
        <Link
          href={`/admin/ProductLists/${ProductId}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          返回
        </Link>

      </p>
      <EditProductForm />
    </>
  );
};

export default EditProductPage;