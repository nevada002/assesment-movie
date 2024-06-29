import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Watermark from './Watermark'

export default function Layout() {
    return (
        <Fragment>
            <div className="layout">
                <Header />
                <Outlet className="bg-color-primary" />
                <Watermark />
            </div>
        </Fragment>
    )
}
