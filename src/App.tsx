import { ConfigProvider } from 'antd'
import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import DashboardLayout from './components/DashboardLayout'
import AdminPage from './pages/AdminPage'
import ForbiddenPage from './pages/ForbiddenPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import TableListPage from './pages/TableListPage'
import WelcomePage from './pages/WelcomePage'
import { authState, initAuth, loginAction, logoutAction } from './state/auth'

function RequireAuth() {
  const snap = useSnapshot(authState)
  const location = useLocation()

  if (snap.initializing)
    return null

  if (!snap.currentUser) {
    const redirect = encodeURIComponent(location.pathname)
    return <Navigate replace to={`/user/login?redirect=${redirect}`} />
  }

  return <Outlet />
}

function RequireAdmin() {
  const snap = useSnapshot(authState)
  if (snap.currentUser?.access !== 'admin')
    return <ForbiddenPage />
  return <Outlet />
}

function ShellLayout() {
  const navigate = useNavigate()
  const snap = useSnapshot(authState)

  if (!snap.currentUser)
    return null

  return (
    <DashboardLayout
      onLogout={async () => {
        await logoutAction()
        navigate('/user/login', { replace: true })
      }}
      user={snap.currentUser}
    >
      <Outlet />
    </DashboardLayout>
  )
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const snap = useSnapshot(authState)

  useEffect(() => {
    void initAuth()
  }, [])

  return (
    <ConfigProvider>
      <Routes>
        <Route
          element={(
            <LoginPage
              onLogin={loginAction}
              onSuccess={(path) => navigate(path, { replace: true })}
              search={location.search}
            />
          )}
          path="/user/login"
        />

        <Route element={<RequireAuth />}>
          <Route element={<ShellLayout />}>
            <Route element={<Navigate replace to="/welcome" />} path="/" />
            <Route element={<WelcomePage />} path="/welcome" />
            <Route element={<Navigate replace to="/admin/sub-page" />} path="/admin" />
            <Route element={<RequireAdmin />}>
              <Route element={<AdminPage />} path="/admin/sub-page" />
            </Route>
            <Route element={<TableListPage />} path="/list" />
            <Route element={<NotFoundPage />} path="*" />
          </Route>
        </Route>

        {!snap.initializing && <Route element={<Navigate replace to="/user/login" />} path="*" />}
      </Routes>
    </ConfigProvider>
  )
}

export default App
