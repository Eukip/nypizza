import React from 'react'

export const navAdmin =  [
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Новый заказ',
  //   to: '/orders/new-order',
  //   icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="c-sidebar-nav-icon" role="img">
  //     <polygon fill="var(--ci-primary-color, currentColor)"
  //              points="160 96.039 160 128.039 464 128.039 464 191.384 428.5 304.039 149.932 304.039 109.932 16 16 16 16 48 82.068 48 122.068 336.039 451.968 336.039 496 196.306 496 96.039 160 96.039"
  //              className="ci-primary"></polygon>
  //     <path fill="var(--ci-primary-color, currentColor)"
  //           d="M176.984,368.344a64.073,64.073,0,0,0-64,64h0a64,64,0,0,0,128,0h0A64.072,64.072,0,0,0,176.984,368.344Zm0,96a32,32,0,1,1,32-32A32.038,32.038,0,0,1,176.984,464.344Z"
  //           className="ci-primary"></path>
  //     <path fill="var(--ci-primary-color, currentColor)"
  //           d="M400.984,368.344a64.073,64.073,0,0,0-64,64h0a64,64,0,0,0,128,0h0A64.072,64.072,0,0,0,400.984,368.344Zm0,96a32,32,0,1,1,32-32A32.038,32.038,0,0,1,400.984,464.344Z"
  //           className="ci-primary"></path>
  //   </svg>,
  // },
  {
    _tag: 'CSidebarNavItem',
    name: 'Заказы',
    to: '/orders',
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="c-sidebar-nav-icon" role="img">
      <polygon fill="var(--ci-primary-color, currentColor)"
  points="160 96.039 160 128.039 464 128.039 464 191.384 428.5 304.039 149.932 304.039 109.932 16 16 16 16 48 82.068 48 122.068 336.039 451.968 336.039 496 196.306 496 96.039 160 96.039"
  className="ci-primary"/>
      <path fill="var(--ci-primary-color, currentColor)"
  d="M176.984,368.344a64.073,64.073,0,0,0-64,64h0a64,64,0,0,0,128,0h0A64.072,64.072,0,0,0,176.984,368.344Zm0,96a32,32,0,1,1,32-32A32.038,32.038,0,0,1,176.984,464.344Z"
  className="ci-primary"/>
      <path fill="var(--ci-primary-color, currentColor)"
  d="M400.984,368.344a64.073,64.073,0,0,0-64,64h0a64,64,0,0,0,128,0h0A64.072,64.072,0,0,0,400.984,368.344Zm0,96a32,32,0,1,1,32-32A32.038,32.038,0,0,1,400.984,464.344Z"
  className="ci-primary"/>
    </svg>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Продукты',
    to: '/',
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="c-sidebar-nav-icon" role="img">
      <path fill="var(--ci-primary-color, currentColor)"
  d="M472,472H40a24.028,24.028,0,0,1-24-24V64A24.028,24.028,0,0,1,40,40H226.667a23.935,23.935,0,0,1,22.154,14.77L269.333,104H472a24.028,24.028,0,0,1,24,24V448A24.028,24.028,0,0,1,472,472ZM48,440H464V136H248L221.333,72H48Z"
  className="ci-primary"/>
    </svg>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Категории',
    to: '/categories',
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="c-sidebar-nav-icon" role="img">
      <path fill="var(--ci-primary-color, currentColor)" d="M136,24H16V144H136Zm-32,88H48V56h56Z"
  className="ci-primary"/>
      <path fill="var(--ci-primary-color, currentColor)" d="M136,200H16V320H136Zm-32,88H48V232h56Z"
  className="ci-primary"/>
      <path fill="var(--ci-primary-color, currentColor)" d="M136,376H16V496H136Zm-32,88H48V408h56Z"
  className="ci-primary"/>
      <rect width="320" height="32" x="176" y="23.998" fill="var(--ci-primary-color, currentColor)"
  className="ci-primary"/>
      <rect width="256" height="32" x="176" y="111.998" fill="var(--ci-primary-color, currentColor)"
  className="ci-primary"/>
      <rect width="320" height="32" x="176" y="199.998" fill="var(--ci-primary-color, currentColor)"
  className="ci-primary"/>
      <rect width="256" height="32" x="176" y="287.998" fill="var(--ci-primary-color, currentColor)"
  className="ci-primary"/>
      <rect width="256" height="32" x="176" y="463.998" fill="var(--ci-primary-color, currentColor)"
  className="ci-primary"/>
      <rect width="320" height="32" x="176" y="375.998" fill="var(--ci-primary-color, currentColor)"
  className="ci-primary"/>
    </svg>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Клиенты',
    to: '/clients',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               className="c-sidebar-nav-icon"  viewBox="0 0 16 16">
      <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
      <path fillRule="evenodd"
            d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
      <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
    </svg>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Бонусы',
    to: '/bonus',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               className="c-sidebar-nav-icon" viewBox="0 0 16 16">
      <path
        d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
    </svg>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Информация об условиях',
    to: '/conditions',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               className="c-sidebar-nav-icon" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path
        d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
    </svg>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Акции',
    to: '/stocks',
    icon: <svg xmlns="http://www.w3.org/2000/svg"  width="16" height="16" fill="currentColor"  className="c-sidebar-nav-icon"
               viewBox="0 0 16 16">
      <path
        d="M13.442 2.558a.625.625 0 0 1 0 .884l-10 10a.625.625 0 1 1-.884-.884l10-10a.625.625 0 0 1 .884 0zM4.5 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm7 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
    </svg>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Создание пользователя',
    to: '/create-user',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="c-sidebar-nav-icon"
               viewBox="0 0 16 16">
      <path
        d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
    </svg>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Отчеты',
    to: '/reports',
    icon: <svg className="c-sidebar-nav-icon" width={16} height={16} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
               viewBox="0 0 490.24 490.24" style={{enableBackground: "new 0 0 490.24 490.24"}} xmlSpace="preserve">
      <g>
        <path d="M259.367,182.89v160.498h-17.408c-10.19,0-17.969,4.075-21.339,11.181c-3.371,7.106-1.606,15.708,4.84,23.601l57.354,70.21
          c5.78,7.073,13.995,11.131,22.54,11.131c8.544,0,16.76-4.057,22.541-11.132l57.353-70.209c6.447-7.894,8.211-16.495,4.84-23.601
          c-3.371-7.105-11.148-11.181-21.338-11.181h-17.409V182.892c0-11.631-9.462-21.094-21.093-21.094H280.46
          C268.829,161.798,259.367,171.26,259.367,182.89z M241.304,364.388h28.563c5.799,0,10.5-4.701,10.5-10.5V182.89
          c0-0.051,0.042-0.092,0.093-0.092h49.787c0.052,0,0.093,0.041,0.093,0.094v170.996c0,5.799,4.701,10.5,10.5,10.5l28.67-0.01
          l-57.879,70.714c-1.801,2.204-4.031,3.418-6.278,3.418c-2.247,0-4.477-1.214-6.277-3.417L241.304,364.388z"
        />
        <path d="M121.49,146.853h17.409V307.35c0,11.631,9.462,21.093,21.093,21.093h49.787c11.631,0,21.093-9.462,21.093-21.092V146.853
          h17.408c10.19,0,17.969-4.075,21.339-11.181c3.371-7.107,1.606-15.708-4.84-23.601l-57.354-70.21
          c-5.78-7.073-13.995-11.131-22.54-11.131c-8.544,0-16.76,4.057-22.541,11.132l-57.352,70.209
          c-6.447,7.894-8.212,16.495-4.841,23.602C103.523,142.777,111.3,146.853,121.49,146.853z M120.851,125.853l57.758-70.704
          c1.801-2.204,4.031-3.418,6.278-3.418c2.247,0,4.477,1.214,6.277,3.417l57.766,70.705h-28.556c-5.799,0-10.5,4.701-10.5,10.5
          v170.998c0,0.051-0.042,0.092-0.093,0.092h-49.787c-0.052,0-0.093-0.041-0.093-0.093V136.353c0-5.799-4.701-10.5-10.5-10.5H120.851
          z"
        />
        <path d="M418.049,0H72.191c-5.799,0-10.5,4.701-10.5,10.5v469.24c0,5.799,4.701,10.5,10.5,10.5h345.858
          c5.799,0,10.5-4.701,10.5-10.5V10.5C428.549,4.701,423.848,0,418.049,0z M407.549,469.24H82.691V21h324.858V469.24z"
        />
      </g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/>
  </svg>
  },
]

export const navOperator = [
  {
    _tag: 'CSidebarNavItem',
    name: 'Заказы',
    to: '/orders',
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="c-sidebar-nav-icon" role="img">
      <polygon fill="var(--ci-primary-color, currentColor)"
               points="160 96.039 160 128.039 464 128.039 464 191.384 428.5 304.039 149.932 304.039 109.932 16 16 16 16 48 82.068 48 122.068 336.039 451.968 336.039 496 196.306 496 96.039 160 96.039"
               className="ci-primary"/>
      <path fill="var(--ci-primary-color, currentColor)"
            d="M176.984,368.344a64.073,64.073,0,0,0-64,64h0a64,64,0,0,0,128,0h0A64.072,64.072,0,0,0,176.984,368.344Zm0,96a32,32,0,1,1,32-32A32.038,32.038,0,0,1,176.984,464.344Z"
            className="ci-primary"/>
      <path fill="var(--ci-primary-color, currentColor)"
            d="M400.984,368.344a64.073,64.073,0,0,0-64,64h0a64,64,0,0,0,128,0h0A64.072,64.072,0,0,0,400.984,368.344Zm0,96a32,32,0,1,1,32-32A32.038,32.038,0,0,1,400.984,464.344Z"
            className="ci-primary"/>
    </svg>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Клиенты',
    to: '/clients',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               className="c-sidebar-nav-icon"  viewBox="0 0 16 16">
      <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
      <path fillRule="evenodd"
            d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
      <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
    </svg>,
  },
]
