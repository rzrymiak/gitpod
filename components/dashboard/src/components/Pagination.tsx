/**
 * Copyright (c) 2022 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

function Pagination(props: { numberOfPages: number; currentPage: number; setCurrentPage: any }) {
    const { numberOfPages, currentPage, setCurrentPage } = props;
    const availablePageNumbers = [...Array(numberOfPages + 1).keys()].slice(1);

    const nextPage = () => {
        if (currentPage !== numberOfPages) setCurrentPage(currentPage + 1);
    };
    const prevPage = () => {
        if (currentPage !== 1) setCurrentPage(currentPage - 1);
    };

    return (
        <nav>
            <ul className="flex justify-center space-x-5">
                <li className="text-gray-400">
                    <span onClick={prevPage}>
                        Previous
                    </span>
                </li>
                {availablePageNumbers.map((pn) => (
                    <li key={pn} className={`text-gray-500 ${currentPage === pn ? "bg-gray-200" : ""} `}>
                        <span onClick={() => setCurrentPage(pn)}>
                            {pn}
                        </span>
                    </li>
                ))}
                <li className="text-gray-400">
                    <span onClick={nextPage}>
                        Next
                    </span>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;
