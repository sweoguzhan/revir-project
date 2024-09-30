import React, {FC} from 'react'
import {WithChildren} from '../react18MigrationHelpers'
import { PagingData } from "../../../app/pages/users/core/models";
import { DOTS, usePagination } from "../usePagination";

type Props = {
  pagingData: PagingData
  currentPage: number,
  prevPage: () => void,
  nextPage: () => void,
  setPage: (page: number) => void,
}

const Pagination: FC<Props & WithChildren> = (props) => {
  const {
    pagingData,
    currentPage,
    prevPage,
    nextPage,
    setPage,
  } = props

  const pageArray = (size: number) => {
    const nums = [] as number[];
    for (let i = 1; i <= size; i++) {
      nums.push(i);
    }

    return nums;
  };

  const paginationRange = usePagination({
    currentPage,
    pagingData
  });


  return (
    <ul className='pagination'>
      <li className={currentPage > 1 ? 'page-item previous' : 'page-item previous disabled'}>
        <a className='page-link cursor-pointer' onClick={prevPage}>
          <i className='previous'></i>
        </a>
      </li>
      {paginationRange?.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return <li className="pagination-item dots">&#8230;</li>;
        }

        return (
          <li className={currentPage === pageNumber ? 'page-item disabled' : 'page-item'} key={index}>
            <a className='page-link cursor-pointer' onClick={() => {
              setPage( pageNumber);
            }}>{pageNumber}</a>
          </li>
        );
      })}
      <li className={currentPage < pagingData.totalPages ? 'page-item next' : 'page-item next disabled'}>
        <a className='page-link cursor-pointer' onClick={nextPage}>
          <i className='next'></i>
        </a>
      </li>
    </ul>
  )
}

export {Pagination}
