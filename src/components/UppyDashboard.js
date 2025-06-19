import { useEffect } from 'react';
// uppy
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import Dashboard from '@uppy/dashboard';
// Uppy css
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import '@uppy/progress-bar/dist/style.css';

const UppyDashboard = () => {
  useEffect(() => {
    const uppy = new Uppy()
      .use(Dashboard, {
        inline: true,
        target: '.file-uploader',
      }).use(Tus, { endpoint: 'https://master.tus.io/files/' });
  
    return () => {
      uppy.close();
    };
  }, []);

  return <div className="file-uploader"></div>;
};
export default UppyDashboard