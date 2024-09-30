/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {FiUsers} from 'react-icons/fi';
import {RiUserSharedLine} from 'react-icons/ri';
import {MdOutlineSick,MdOutlineMedicalServices} from 'react-icons/md';
import {AiOutlineArrowRight} from 'react-icons/ai';
type Props = {
    className:string
    Text:string
    icon:string
}
const CheckLastForms: React.FC<Props> = ({className, Text,icon }) => {
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
                        <AiOutlineArrowRight  className='icon-arrow' />
                        <p className='formcheck-text'>{Text}</p>
                    </div>
                </div>
            </div>


        </>


    )
}



export {CheckLastForms}
