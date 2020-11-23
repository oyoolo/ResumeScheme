
import React from 'react'
import Layout from './layout.jsx'
export default (props) => {
  return (
    <Layout>
      <h1 className="mt-4">Dashboard</h1>
      <p className="lead mb-3">{props.user.fullname} </p>
      <nav className="navbar navbar-dark " style="text-align: left">
        <form className="form-inline" >
          <button className="btn btn-outline-success" type="button">Submit Resume</button>
          <button className="btn btn-outline-success" type="button">See Jobs</button>
          <a className="btn btn-outline-danger" href="/users/logout" role="button">Logout</a>
        </form>
      </nav>

    </Layout>

  )
}
