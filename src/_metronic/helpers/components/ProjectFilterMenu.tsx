import React, { FC, useEffect, useRef, useState } from "react";
import {AllProject} from '../../../app/pages/users/core/models';
import { KTSVG } from "./KTSVG";
import { ProjectFilterSelect } from "./ProjectFilterSelect";

type Props = {
  allProjects: AllProject[]
  onProjectChange: (option) => void
  onFilterClick: () => void
  onResetClick: () => void
}

const ProjectFilterMenu: FC<Props> = ({allProjects, onProjectChange, onFilterClick, onResetClick}) => {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = e => {
    if (menuRef === null || menuRef.current === null) {
      return;
    }

    if (!menuRef.current.contains(e.target)) {
      setFilterMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  return (
    <div ref={menuRef} className='position-relative'>
      <button
        type='button'
        className='btn btn-light-primary me-3'
        onClick={() => {
          setFilterMenuOpen(!filterMenuOpen);
        }}
      >
        <KTSVG path='/media/icons/duotune/general/gen031.svg' className='svg-icon-2' />
        Filtrele
      </button>

      <div
        className={filterMenuOpen ? 'menu menu-sub menu-sub-dropdown w-300px w-md-325px position-absolute top-100 end-0 z-index-5 d-block' : 'menu menu-sub menu-sub-dropdown w-300px w-md-325px position-absolute top-100 end-0 z-index-5'}
      >
        <div className='px-7 py-5'>
          <div className='fs-5 text-dark fw-bolder'>Filtre Seçenekleri</div>
        </div>
        <div className='separator border-gray-200'></div>
        <div className='px-7 py-5'>
          <div className='mb-10'>
            <label className='form-label fs-6 fw-bold'>Proje:</label>
            <ProjectFilterSelect
              allProjects={allProjects}
              onProjectChange={onProjectChange}
              showAllProjects={false}
            />
          </div>
          <div className='d-flex justify-content-end'>
            <button
              type='button'
              className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
              onClick={() => {
                setFilterMenuOpen(false);
                onResetClick();
              }}
            >
              Reset
            </button>
            <button
              type='button'
              className='btn btn-primary fw-bold px-6'
              onClick={() => {
                setFilterMenuOpen(false);
                onFilterClick();
              }}
            >
              Uygula
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export {ProjectFilterMenu}
