import Auth from "./pages/Auth/Auth"
import Home from "./pages/home/Home";
import './App.scss'
import {createBrowserRouter ,RouterProvider } from "react-router-dom";
function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Home/>
      )
    },
    {
      path: "/auth",
      element: (
        <Auth/>
      )
    }
  ])
  return (
    <div className="App">
        <div className="blur" style={{top: '-18%', right: '0'}}></div>
        <div className="blur" style={{top: '36%', left: '-8rem'}}></div>
        <main>
            <RouterProvider router={router}></RouterProvider>
        </main>
    </div>
  )
}

export default App
