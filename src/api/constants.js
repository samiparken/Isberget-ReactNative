export const GRANT_TYPE_PASSWORD = 'password';
export const CONTENT_TYPE = 'application/x-www-form-urlencoded';
export const INSTALLER = 'Installatör';

export const USERS_IN_COMPANY = '/api/account/GetUsersInCompany?CompanyId=';

export const API_ENDPOINTS = {
  Login: '/token',
  Protocol: '/breeze/BreezeOrder/NativeAppSignInstallationProtocol',
  ResetPassword: '/api/account/forgotpassword',
  GetUsersInCompany: '/api/account/getusersincompany',
  GetAllCompanyInfo: '/breeze/BreezeRoleBased/GetAllUserData',
  GetUserData: '/api/account/GetUserData',
  GetCompanyId: '/breeze/BreezeGeneric/GetCurrentUserCompaniesAndChildren?$orderby=company_name',
  GetCurrentUserCompaniesAndChildren: '/breeze/BreezeGeneric/GetCurrentUserCompaniesAndChildren',

  GetMessages: '/api/EffectiveInstallers/GetMessages',
  SetMessageRead: '/api/EffectiveInstallers/SetReadMessage',

  UnacepetedJobs: '/breeze/BreezeBooking/NativeAppGetUnacceptedInstallations',
  AcceptJobWithId: '/breeze/BreezeBooking/SetJobAccepted',
  DeclineJob: '/breeze/BreezeBooking/SetJobRejected',

  //unbookedJobs
  BookedJobs: '/breeze/BreezeBooking/NativeAppGetAcceptedInstallations',

  SearchedWithQuery: '/breeze/BreezeSearch/NativeAppGetSearchOrdersAsList',

  
  sentToCustomerJobs: '/breeze/BreezeSearch/NativeAppGetBookedOrdersInstallations',
  
// NativeAppGetAllOrdersByInstallerCompany
// NativeAppGetOrdersWithData
// NativeAppGetEventsWithData
// NativeAppGetOrderEventsWithData
// NativeAppGetOrderEventsForInstallerOrderByDate
// NativeAppGetOrderEventsForCompanyByDate

// NativeAppGetEventsForCompanyByDate

//NativeAppGetOrderEventsForInstallerOrderByDate(int userId, DateTime fromDate, DateTime toDate)
//NativeAppGetOrderEventsForCompanyByDate(int companyId, DateTime fromDate, DateTime toDate)


// yellow & green
//NativeAppGetEventsForCompanyByDate(int companyId, DateTime fromDate, DateTime toDate)

  RejectJobWithId: '/breeze/BreezeBooking/SetJobRejected?',

  GetEventsForCompanyByDate: '/breeze/BreezeCalendar/NativeAppGetEventsForCompanyByDate',
  BookJobInCalendar: '/breeze/BreezeCalendar/BookJobInCalendar',
  SetNewOrderComment: '/breeze/BreezeOrder/SetOrderMessage',
  DeleteEventFromCalendar: '/breeze/BreezeCalendar/NativeAppDeleteEvent',

  SendCustomerBookingProposal: '/breeze/BreezeCalendar/SendCustomerBookingProposal',
  BookJobConfirmedCustomer: '/breeze/BreezeCalendar/BookJobConfirmedCustomer',

  UpdateDeviceToken: '/api/BreezeNativeApp/UpdateUserDeviceNotificationToken',
  updateJob: '/breeze/BreezeCalendar/UpdateOrderData',

  GetUserRolesWithoutUserId: '/BreezeGeneric/GetUserRolesWithoutUserId',
  GetCustomerHistory: '/breeze/BreezeCalendar/GetCustomerAnswerHistoryNew',

  GetCompanyAddress: '/api/EffectiveInstallers/GetCompanyAddress',
  GetCompanyLocation: '/api/EffectiveInstallers/GetCompanyLocation',
};

export const ORDER_STATUS_TEXT = {
  accepted: 'Tilldelad företag',
  notBookedWithCustomer: 'Inte bokad med kund',
  bookedWithCustomer: 'Bokad med kund',
  notAccpeted: 'Inte accepterad än',
  completed: 'Installation klar',
};

export const NOTIFICATION_TYPES = {
  newJobs: 'newJobs',
  jobAccepted: 'jobAccepted',
  bookJob: 'bookJob',
  jobUpdate: 'jobUpdate',
  jobCancelled: 'jobCancelled',
}
