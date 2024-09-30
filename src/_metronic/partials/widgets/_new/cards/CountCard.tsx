/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import {FiUsers} from 'react-icons/fi';
import {RiUserSharedLine} from 'react-icons/ri';
import {MdOutlineSick,MdOutlineMedicalServices} from 'react-icons/md';
type Props = {
    className:string
    Text:string
    icon:string
    count:string



}


const CountCard: React.FC<Props> = ({className, Text,icon,count }) => {
    return (
       <>
            <div className="counter-container">
                    <div className="four col-md-10">
                        <div className={`${className} colored`}>
                            {icon === 'FiUsers' && (
                                <FiUsers className='icon'   />
                            )}
                            {icon === 'RiUserSharedLine' && (
                                <RiUserSharedLine  className='icon'  />
                            )}
                            {icon === 'MdOutlineSick' && (
                                <MdOutlineSick  className='icon'  />
                            )}
                            {icon === 'MdOutlineMedicalServices' && (
                                <MdOutlineMedicalServices  className='icon' />
                            )}
                            <span className="counter">{count}</span>
                            <p className='counter-text'>{Text}</p>
                        </div>
                    </div>
            </div>


       </>


    )
}



export {CountCard}
