import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-RegisterForm',
  templateUrl: './RegisterForm.component.html',
  styleUrls: ['./RegisterForm.component.scss']
})
export class RegisterFormComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }
  
  studentuser: any= {};
  studentsData: any=[];
  isUpdate:boolean=false;
  isNotValid:boolean=false;
  isEligible: boolean=true;
  selectedIndex=-1;
  users:String[]=[];
  submitOrUpdateText: string ="";

  registrationForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]+$")]],
    lastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]+$")]],
    email: ['', [Validators.required,  Validators.pattern("[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")]],
    password: ['', [Validators.required,Validators.minLength(6),Validators.maxLength(16),Validators.pattern("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$")]],
    confirmPassword: ['', [Validators.required]],
    dateOfbirth: ['', [Validators.required]],
    mobileNumber1: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
    mobileNumber2: ['', [Validators.pattern("^[0-9]{10}$")]],
    gender: ['', Validators.required],
    course: ['', Validators.required]
  });


  get firstName() {
    return this.registrationForm.get('firstName');
  }
  get lastName() {
    return this.registrationForm.get('lastName');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get password() {
    return this.registrationForm.get('password');
  }
  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }
  
  get dateOfbirth() {
    return this.registrationForm.get('dateOfbirth');
  }
  get course() {
    return this.registrationForm.get('course');
  }
  get mobileNumber1() {
    return this.registrationForm.get('mobileNumber1');
  }
  get mobileNumber2() {
    return this.registrationForm.get('mobileNumber2');
  }
  get gender() {
    return this.registrationForm.get('gender');
  }
  
  ngOnInit() {
    this.studentsData = JSON.parse(localStorage.getItem("Users") || '{}');
  }
  
  onSubmit(){    
    if (this.registrationForm.valid){
      this.isUpdate=false;
      this.isNotValid=false;

      this.users=[];
      this.studentuser=Object.assign(this.studentuser,this.registrationForm.value);
      
      if(this.selectedIndex==-1){
        if(localStorage.getItem('Users')){
          this.users= JSON.parse(localStorage.getItem('Users') || '{}');
          this.users=[...this.users,this.studentuser];
        }
        else{
          this.users=[this.studentuser];
        }
        this.submitOrUpdateText = "Your data is Submitted!";
      }
      else{
        if(localStorage.getItem('Users')){
          this.users= JSON.parse(localStorage.getItem('Users') || '{}');
          this.users.splice(this.selectedIndex,1,this.studentuser);
        }
        else{
          this.users=[this.studentuser];
        }
        this.submitOrUpdateText = "Your data is Updated!";
      }
      
      localStorage.setItem('Users',JSON.stringify(this.users));
      this.registrationForm.reset();
      this.selectedIndex=-1;
      swal.fire('Done', this.submitOrUpdateText, 'success');
    }
    else {
      this.isNotValid=true;
      swal.fire('Error', 'Please fill in all required fields', 'warning');
    }
    this.loadData();
  }

  editStudentData(i:number){
    this.isUpdate=true;
    this.selectedIndex=i;
    console.log(this.studentsData[i]);
    this.registrationForm = this.formBuilder.group({
    firstName: [this.studentsData[i].firstName,[Validators.required, Validators.pattern("^[a-zA-Z]+$")]],
    lastName: [this.studentsData[i].lastName, [Validators.required, Validators.pattern("^[a-zA-Z]+$")] ],
    email: [this.studentsData[i].email, [Validators.required,  Validators.pattern("[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")] ],
    password: [this.studentsData[i].password, [Validators.required,Validators.minLength(6),Validators.maxLength(16),Validators.pattern("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$")]],
    confirmPassword: ['', [Validators.required] ],
    dateOfbirth: [this.studentsData[i].dateOfbirth, [Validators.required] ],
    mobileNumber1: [this.studentsData[i].mobileNumber1, [Validators.required, Validators.pattern("^[0-9]{10}$")] ],
    mobileNumber2: [this.studentsData[i].mobileNumber2, [Validators.pattern("^[0-9]{10}$")]],
    gender: [this.studentsData[i].gender, Validators.required ],
    course: [this.studentsData[i].course, Validators.required ]
    })
  }

  deleteStudentData(i:number){
    swal.fire({
      title: 'Do you want to delete this data?',
      text: 'Data will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'remove data!',
      cancelButtonText: 'cancel'
    }).then((result) => {
      if (result.value) {
        swal.fire(
          'Removed!',
          'Your data has been removed.',
          'success'
        )
        this.users= JSON.parse(localStorage.getItem('Users') || '{}');
        this.users.splice(i,1);
        localStorage.setItem('Users',JSON.stringify(this.users));
        this.loadData();
        
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal.fire(
          'Cancelled',
          'Record deletion cancel ',
          'error'
        )
      }
    })    
  }

  validateDOB(){
    let year = new Date(this.dateOfbirth?.value).getFullYear();
    let today = new Date().getFullYear();
    if(today - year >= 12){
        this.isEligible=false;
    }
    else{
      this.isEligible=true;
    }
  }

  loadData(){
    this.studentsData = JSON.parse(localStorage.getItem("Users") || '{}');
  }
  

}
