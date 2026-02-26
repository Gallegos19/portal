import React from 'react';
import AdminFormatos from '../admin/Formatos';

const Formatos: React.FC = () => {
  return <AdminFormatos canCreate={false} canEdit={false} canDelete={false} />;
};

export default Formatos;
