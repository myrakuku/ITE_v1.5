"use client";

import { useEffect, useState } from "react";

interface AccountsData {
    id: string;
    client_name: string;
    title:string;
    description:string;
    price: number;
    total: number;
    date: string;

}


const AccountsListsPage = () => {

    const [ GetAccountsData , setGetAccountsData] = useState<AccountsData | []>([]);

    useEffect(() => {
        const  fetchAccountsData = async () => {
            const response = await fetch("/api/Accounts/Get_Accounts_Lists");
            const data = await response.json();
            setGetAccountsData(data);
        }
        fetchAccountsData();
    }, []);

    console.log("GetAccountsData : ", GetAccountsData , " -- End -- ")

    return (
        <>
            AccountsListsPage
        </>
    )
}

export default AccountsListsPage;