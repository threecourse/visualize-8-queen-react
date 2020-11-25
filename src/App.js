import './styles/index.css'
import 'bulma/bulma.sass'
import 'react-toastify/dist/ReactToastify.css'
import './styles/toastr.css'
import Controller from './components/controller'
import Main from './components/main'
import { ToastContainer } from 'react-toastify'

function App () {
  return (
    <div>
      <nav className="navbar is-light">
        <div className="container">
          <div className="navbar-brand">
            <div className="navbar-item title is-3">
              Visualize 8-queen
            </div>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="columns my-0">
          <div className={'column pt-5 column-controller'}>
            <Controller/>
          </div>
          <div className={'column is-9 pt-5 column-main'}>
            <Main/>
          </div>
        </div>
      </div>
      <div>
        <ToastContainer />
      </div>
    </div>
  )
}

export default App
