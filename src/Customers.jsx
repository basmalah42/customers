
import React, { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [nameFilter, setNameFilter] = useState("");
    const [AmountFilter, setAmountFilter] = useState("");
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [DiagrameId, setDiagrameId] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const customersResponse = await fetch("http://localhost:3000/customers");
                const customersData = await customersResponse.json();
                setCustomers(customersData);

                const transactionsResponse = await fetch("http://localhost:3000/transactions");
                const transactionsData = await transactionsResponse.json();
                setTransactions(transactionsData);

                // console.log("Customers Data:", customersData);
                // console.log("Transactions Data:", transactionsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        const customerTransactions = transactions.filter(t => t.customer_id === parseInt(DiagrameId));

        const amountsPerDay = customerTransactions.reduce((acc, transaction) => {
            const date = transaction.date.split('T')[0];
            acc[date] = (acc[date] || 0) + transaction.amount;
            return acc;
        }, {});

        setChartData({
            labels: Object.keys(amountsPerDay),
            datasets: [{
                label: `Total Transaction Amount for Customer ID: ${DiagrameId}`,
                data: Object.values(amountsPerDay),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }]
        });
    }, [DiagrameId]);


    const getTransactionsForCustomer = (customerId) => {

        const customerTransactions = transactions.filter(
            (transaction) =>
                transaction.customer_id == customerId
                && transaction.amount.toString().includes(AmountFilter)
        );
        // console.log(`Transactions for customer ID ${customerId}:`, customerTransactions);
        return customerTransactions;
    };

    const filteredCustomers = customers.filter(
        (customer) => customer.name.toLowerCase().includes(nameFilter.toLowerCase())
    );

    return (
        <div className='max-w-screen-2xl mx-auto'>
            <div className="container mx-auto min-h-screen p-6 md:p-8 lg:p-12 xl:p-16">
                <h1 className="text-4xl text-[#252422] pb-6 font-bold text-center">
                    Customers
                </h1>
                <div className="flex justify-between items-center mb-4">
                    <div className="w-full flex flex-col md:flex-row justify-between gap-6 mx-auto">
                        <div className="md:w-[50%] w-full">
                            <label
                                htmlFor="name-search"
                                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                            >
                                Search
                            </label>
                            <div className="relative">
                                <input
                                    onChange={(e) => setNameFilter(e.target.value)}
                                    type="search"
                                    id="name-search"
                                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-[#252422] focus:border-[#252422] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#252422] dark:focus:border-[#252422]"
                                    placeholder="Search By Name"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="text-white absolute end-2.5 bottom-2.5 bg-[#252422]  focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-[#252422] dark:focus:ring-blue-800"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="md:w-[50%] w-full">
                            <label
                                htmlFor="amount-search"
                                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                            >
                                Search
                            </label>
                            <div className="relative">
                                <input
                                    onChange={(e) => setAmountFilter(e.target.value)}
                                    type="search"
                                    id="amount-search"
                                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-[#252422] focus:border-[#252422] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#252422] dark:focus:border-[#252422]"
                                    placeholder="Search By Amount"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="text-white absolute end-2.5 bottom-2.5 bg-[#252422] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-[#252422] dark:focus:ring-blue-800"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr className="bg-[#252422]">
                                <th scope="col" className="px-6 py-3 text-center text-[#fffcf2] text-sm md:text-[18px]">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-[#fffcf2] text-sm md:text-[18px]">
                                    Customer Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-[#fffcf2] text-sm md:text-[18px]">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-[#fffcf2] text-sm md:text-[18px]">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-[#fffcf2] text-sm md:text-[18px]">
                                    Agraph
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {console.log(filteredCustomers)}
                            {filteredCustomers.map((customer) => {

                                const customerTransactions = getTransactionsForCustomer(customer.id);


                                return customerTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 text-center py-4">{customer.id}</td>
                                        <td className="px-6 text-center py-4">{customer.name}</td>
                                        <td className="px-6 text-center py-4">{transaction.date}</td>
                                        <td className="px-6 text-center py-4">{transaction.amount}</td>
                                        <td className="px-6 text-center py-4">
                                            <button onClick={() => setDiagrameId(customer.id)} type="button" class="text-[#403d39] hover:text-white border border-[#403d39] hover:bg-[#403d39] focus:ring-4 focus:outline-none focus:ring-[#403d39] font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">Diagram</button>
                                        </td>
                                    </tr>
                                ));
                            })}
                        </tbody>
                    </table>
                </div>

                <div className='container h-[70vh] mx-auto p-4 md:p-6 lg:p-8 xl:p-16 '>
                    <div className="w-full h-full">
                        <Bar data={chartData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                }
                            }
                        }} />
                    </div>
                </div>
            </div>
        </div>

    );
}
