import React, {FC, useEffect, useState} from 'react';
import {AllProject} from '../../../app/pages/users/core/models';
import Select from 'react-select';

type Props = {
  allProjects: AllProject[]
  onProjectChange: (option) => void
  showAllProjects: boolean
}

const ProjectFilterSelect: FC<Props> = ({allProjects, onProjectChange, showAllProjects}) => {
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectSelect, setProjectSelect] = useState([] as Array<{
    value: number;
    label: string;
  }>);

  useEffect(() => {
    setProjectsLoading(true);
    if (allProjects.length > 0) {
      const projectTemp = [] as Array<{
        value: number;
        label: string;
      }>;

      if (showAllProjects) {
        projectTemp.push({
          value: 0,
          label: 'Tüm projeler',
        });
      }

      for (let i = 0; allProjects.length > i; i++) {
        projectTemp.push({
          value: allProjects[i].id ?? 0,
          label: allProjects[i].name ?? '',
        });
      }

      setProjectSelect(projectTemp);
      setProjectsLoading(false);
    }
  }, [allProjects]);

  return (
    <Select
      options={projectSelect}
      isLoading={projectsLoading}
      loadingMessage={() => 'Projeler yükleniyor...'}
      noOptionsMessage={() => 'Projeler bulunamadı. Sayfayı yenilemeyi deneyin.'}
      onChange={onProjectChange}
      placeholder={'Proje seçiniz'}
    />
  );
};

export {ProjectFilterSelect}
