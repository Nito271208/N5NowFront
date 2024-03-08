import { show_alert } from './functions'

export function validateFields(Forename,
    Surname, permissionTypeId, permissionGrantedOnDate) {

        if (Forename === '') {
            show_alert('Please write the Employee Forename');
            return false;
        }
        else if (Surname === '') {
            show_alert('Please write the Employee Surname');
            return false;
        }
        else if (permissionTypeId === '') {
            show_alert('Please select the Permission Type');
            return false;
        }
        else if (permissionGrantedOnDate === '') {
            show_alert('Please write the Permission Date');
            return false;
        }
        return true;
}

