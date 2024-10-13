import { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import Navbar from './components/Navbar'
import './components/components.css'
import eye from './assets/eye.svg'
import eye1 from './assets/eye1.svg'
import copy from './assets/copy.svg'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [form, setform] = useState({ site: "", user: "", pass: "" })
  const [passArray, setpassArray] = useState([])

  const getPass = async (e) => {
    let req = await fetch("http://localhost:3000/");
    let passwords = await req.json()
    setpassArray(passwords)
    // console.log(passwords)
  }

  useEffect(() => {
    getPass();
  }, [])

  const ref = useRef();

  const copyText = (e) => {
    toast.info("copied to clipboard ( " + e + " )", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    navigator.clipboard.writeText(e);
  }

  const show = () => {
    if (ref.current.getElementsByTagName("img")[0].src.includes("eye1")) {
      ref.current.getElementsByTagName("img")[0].src = eye;
      pword.type = "text";
    }
    else {
      ref.current.getElementsByTagName("img")[0].src = eye1;
      pword.type = "password";
    }
  }

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }

  const savepass = async (e) => {
    if (form.site == "") {
      document.getElementsByClassName("box")[0].style.border = "1px solid red"
    }
    else if (form.user == "") {
      document.getElementsByClassName("box")[1].style.border = "1px solid red"
    }
    else if (form.pass == "") {
      document.getElementsByClassName("box")[2].style.border = "1px solid red"
    }
    else {
      // If any such id exists in the db, delete it
      await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })

      setpassArray([...passArray, { ...form, id: uuidv4() }])
      await fetch("http://localhost:3000/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: uuidv4() }) })

      setform({ site: "", user: "", pass: "" });
    }
  }

  const Edit = (e) => {
    setform(passArray.filter(pa => { return pa.id === e })[0]);
    setpassArray(passArray.filter(pa => { return pa.id !== e }))
  }

  const Delete = async (e) => {

    setpassArray(passArray.filter(item => item.id != e))

    await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: e }) })
  }

  const sClick = (e) => {
    document.getElementsByClassName("box")[0].style.border = "1px solid green"
  }

  const uClick = (e) => {
    document.getElementsByClassName("box")[1].style.border = "1px solid green"
  }

  const pClick = (e) => {
    document.getElementsByClassName("box")[2].style.border = "1px solid green"
  }


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="Bounce"
      />
      {/* Same as */}
      <ToastContainer />
      <Navbar />
      <div className=' flex flex-col items-center gap-3 pt-8 ' >
        <div className='font-bold text-4xl'>
          <span className='text-green-500'>&#60;</span>
          <span className='text-black'>Pass</span>
          <span className='text-green-500'>OP/&gt;</span>
        </div>
        <div className='text-green-800 text-xl'>Your own password manager</div>
        <input className='box' style={{ width: 'calc(80% + 12px)' }} type="text" placeholder='Enter Website URL' name="site" value={form.site} onChange={handleChange} onClick={sClick} />
        <div className='flex gap-3 justify-center items-center' style={{ width: '100%' }}>
          <input className='box' style={{ width: '60%' }} type="text" placeholder='Enter Username' name="user" value={form.user} onChange={handleChange} onClick={uClick} />
          <div className='relative' style={{ width: '20%' }}>
            <input id="pword" className='box' style={{ width: '100%' }} type="password" placeholder='Password' name="pass" value={form.pass} onChange={handleChange} onClick={pClick} />
            <span ref={ref} className='absolute right-2 bottom-0.5 cursor-pointer bg-white' onClick={show}><img src={eye1} alt="" /></span>
          </div>
        </div>
        <button className='bg-green-400 h-10 w-24 rounded-3xl border border-green-800 flex items-center justify-center gap-1 cursor-pointer' onClick={savepass} ><lord-icon
          src="https://cdn.lordicon.com/tsrgicte.json"
          trigger="hover">
        </lord-icon>Save</button>
        <div className='flex flex-col items-start' style={{ width: 'calc(80% + 12px)' }}>
          <div className='tfont'>Your passwords</div>

          {passArray.length == 0 && <div>no passwords</div>}
          {passArray.length != 0 &&
            <div className="w-full overflow-auto">

              <table className="w-full ">
                <thead>
                  <tr>
                    <th className='thcell w-1/2'>Site</th>
                    <th className='thcell w-1/6'>Username</th>
                    <th className='thcell w-1/6'>Password</th>
                    <th className='thcell w-1/6'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {passArray.map((item, index) => {
                    return <tr key={index}>
                      <td className='trcell'>
                        <div className='flex items-center justify-center gap-2'>
                          <a href={item.site} target="_blank">{item.site}</a> <span className='cursor-pointer h-5 w-5' onClick={() => copyText(item.site)}> <img src={copy} alt="" /></span>
                        </div>
                      </td>

                      <td className='trcell'>
                        <div className='flex items-center justify-center gap-2'>
                          <span> {item.user}</span>
                          <span className='cursor-pointer w-5 h-5' onClick={() => copyText(item.user)}> <img src={copy} alt="" /></span>
                        </div>
                      </td>

                      <td className='trcell'>
                        <div className='flex items-center justify-center gap-2 '>
                          {item.pass} <span className='cursor-pointer h-5 w-5' onClick={() => copyText(item.pass)}> <img src={copy} alt="" /></span>
                        </div>
                      </td>
                      <td className='trcell flex items-center justify-center gap-2 '>

                        <lord-icon className='cursor-pointer h-3 w-3'
                          src="https://cdn.lordicon.com/fikcyfpp.json"
                          trigger="hover"
                          stroke="bold"
                          colors="primary:#121331,secondary:#000000"
                          onClick={() => Edit(item.id)}>
                        </lord-icon>

                        <lord-icon className="h-3 w-3 cursor-pointer"
                          src="https://cdn.lordicon.com/skkahier.json"
                          trigger="hover"
                          onClick={() => Delete(item.id)}>
                        </lord-icon>

                      </td>
                    </tr>
                  })}
                </tbody>
              </table>

            </div>

          }
        </div>
      </div>
    </>
  )
}

export default App
