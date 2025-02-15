import React, { useState, useEffect } from 'react'
import Icon from '@/components/ui/Icon'

const PaginationButton = ({
    totalPages,
    currentPage,
    handlePageChange,
    text,
    className = 'custom-class',
}) => {
    const [pages, setPages] = useState([])

    useEffect(() => {
        let pagesArray = []
        for (let i = 1; i <= totalPages; i++) {
            pagesArray.push(i)
        }
        setPages(pagesArray)
    }, [totalPages])

    return (
        <div className={className}>
            <ul className="pagination">
                <li>
                    <input
                        type="number"
                        className="form-control py-2"
                        value={currentPage}
                        onChange={(e) => {
                            let pageNumber = parseInt(e.target.value)
                            if (pageNumber <= 0) {
                                pageNumber = 1
                            } else if (pageNumber > totalPages) {
                                pageNumber = 1
                            }
                            handlePageChange(pageNumber)
                        }}
                        disabled={totalPages === 1}
                        style={{ width: '50px' }}
                    />
                </li>
            </ul>
        </div>
    )
}

export default PaginationButton
