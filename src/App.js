import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PermissionsOperations from './components/PermissionsOperations';
import PermissionsList from './components/PermissionsList';
import Footer from './components/Footer';



function App() {
  const isRootPage = window.location.pathname === '/';
  return (
    <>
      <div className="menu">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="/">Home</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="PermissionsOperations">Permissions Operations</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="PermissionsList">Permissions List</a>
              </li>
            </ul>
          </div>

        </nav>
      </div>

      {isRootPage}
      <BrowserRouter>
        <Routes>
          <Route path='/PermissionsOperations' element={<PermissionsOperations></PermissionsOperations>}></Route>
          <Route path='/PermissionsList' element={<PermissionsList></PermissionsList>}></Route>
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
