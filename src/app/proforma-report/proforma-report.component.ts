import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../apihandler/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

import * as FileSaver from 'file-saver';
import { type } from 'os';

@Component({
  selector: 'app-proforma-report',
  templateUrl: './proforma-report.component.html',
  styleUrls: ['./proforma-report.component.scss']
})
export class ProformaReportComponent implements OnInit {

  divisionList: any;
  categoryList: any;
  regionList: any;
  pmList: any;

  divisionValue: any = '';
  categoryValue: any = '';
  regionValue: any = '';
  pmValue: any = '';

  PiNo: any = '';
  PIDate: any = 'PIDateBased';

  SoNo: any = '';
  customerId: any = '';
  customer_name: any = '';

  job_code: any = '';
  wbs_value: any = '';

  // public displayedColumns = ['slno', 'prepared_by', 'type', 'description', 'part_name', 'hsn', 'qty',
  // 'uom', 'total', 'submitted_date', 'print', 'print_logo'];

  public displayedColumns = ['slno', 'prepared_by', 'print', 'print_logo', 'mdate', 'division', 'bu_head', 'pm', 'regionName', 'cust_name', 'cust_code',
    'so_no', 'poNo', 'poDate', 'PI_CODE', 'subdate', 'pi_value', 'balance', 'pi_value_usd', 'pi_value_bdt', 'category',
    'job_code', 'wbs', 'bg_no_dt', 'remarks', 'payment_terms', 'mat_ready_date', 'empty'];

  public dataSource = new MatTableDataSource<['']>();

  @ViewChild(MatSort) sort: MatSort;

  proformaTable: any = false;

  fromDate = new FormControl(moment());
  toDate = new FormControl(moment());
  fromdate: any = '';
  todate: any = '';
  userData: any;
  orderAcknowledgementData: any;
  orderItems: any[];
  submittedBy: any;
  divisionName: any;
  pmName: any;
  regionName: any;
  proformaList: any;
  customerCode: any;
  categoryName: any;
  docNo: any;
  //by gautam
  poNo: any;
  poDate: any;
  //end
  submitDate: string;
  customerName: any;
  buHead: any;

  dataItems: any = [{
    submittedBy: '',
    divisionName: '',
    buHead: '',
    pmName: '',
    regionName: '',
    categoryName: '',
    docNo: '',
    //add by gautam
    poNo: '',
    poDate: '',
    //end
    pi_no: '',
    customerCode: '',
    customerName: '',
    submitDate: '',
    pi_value: '',
    balance_value: '',
    description: [],
    jobcode: '',
    wbs: '',
    remarks: ''
  }];

  dataArray: any = []; //declare array
  piCode: any;
  pivalue_inr: any;
  pivalue_usd: any;
  pivalue_bdt: any;
  deleteRecords: boolean = false;


  constructor(
    public apiService: ApiService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.divisionListFunc();
    this.categoryListFunc();
    this.regionListFunc();
    this.pmListFunc();
    this.getUserData();
    // this.getProformaDetails();
  }

  deletedRecords(event: any) {
    this.deleteRecords = event.checked;

    if (this.deleteRecords == true) {
      this.displayedColumns = ['slno', 'prepared_by', 'print', 'print_logo', 'mdate', 'division', 'bu_head', 'pm', 'regionName', 'cust_name', 'cust_code',
        'so_no', 'poNo', 'poDate', 'PI_CODE', 'subdate', 'pi_value', 'balance', 'pi_value_usd', 'pi_value_bdt', 'category',
        'job_code', 'wbs', 'bg_no_dt', 'remarks', 'payment_terms', 'mat_ready_date', 'deleted_remarks', 'empty'];
    } else {
      this.displayedColumns = ['slno', 'prepared_by', 'print', 'print_logo', 'mdate', 'division', 'bu_head', 'pm', 'regionName', 'cust_name', 'cust_code',
        'so_no', 'poNo', 'poDate', 'PI_CODE', 'subdate', 'pi_value', 'balance', 'pi_value_usd', 'pi_value_bdt', 'category',
        'job_code', 'wbs', 'bg_no_dt', 'remarks', 'payment_terms', 'mat_ready_date', 'empty'];
    }

  }


  divisionListFunc() {
    let url = 'division_master_list/'
    this.apiService.getData(url).then((result: any) => {
      this.divisionList = result.records;
    });
  }

  categoryListFunc() {
    let url = 'category_master_list/'
    this.apiService.getData(url).then((result: any) => {
      this.categoryList = result.records;
    });
  }

  regionListFunc() {
    let url = 'region_master_list/'
    this.apiService.getData(url).then((result: any) => {
      this.regionList = result.records;
    });
  }

  pmListFunc() {
    let url = 'projectmanager_master_list/'
    this.apiService.getData(url).then((result: any) => {
      this.pmList = result.records;
    });
  }


  datePickerChange() {
    this.fromdate = this.datePipe.transform(this.fromDate.value, 'yyyy-MM-dd');
    this.todate = this.datePipe.transform(this.toDate.value, 'yyyy-MM-dd');
  }


  getOrderItems() {

    if (this.divisionValue != '' || this.categoryValue != '' || this.regionValue != '' ||
      this.fromdate != '' || this.todate != '' || this.PiNo != '' || this.SoNo != '' ||
      this.customer_name != '' || this.pmValue != '' || this.job_code != '' || this.wbs_value != '' ||
      this.deleteRecords == true) {

      let data = {
        division_value: this.divisionValue == '' ? 0 : this.divisionValue,
        category_value: this.categoryValue == '' ? 0 : this.categoryValue,
        region_value: this.regionValue == '' ? 0 : this.regionValue,
        pm_value: this.pmValue == '' ? 0 : this.pmValue,
        startDate: this.fromdate,
        endDate: this.todate,
        pi_no: this.PiNo == '' ? '' : this.PiNo,
        so_no: this.SoNo == '' ? 0 : this.SoNo,
        pi_date: this.PIDate,
        customer_name: this.customer_name == '' ? '' : this.customer_name,
        jobcode: this.job_code == '' ? '' : this.job_code,
        wbs: this.wbs_value == '' ? '' : this.wbs_value,
        deletedPI: this.deleteRecords
      };


      let Arr = [];
      this.orderAcknowledgementData = [];
      this.orderItems = [];

      let url = 'order_ack_list/';
      this.apiService.filterData(url, { params: data }).then((result: any) => {
        if (result.totalRecords != 0) {
          this.dataSource = new MatTableDataSource(result.records);
          this.dataSource.data = result.records;
          this.proformaList = result.proforma;
          console.log('proforma list', this.proformaList)//
          this.proformaTable = true;

          this.dataArray = []; //call  array

          let data: any = result.records;
          data?.forEach((element, index) => {
            Arr.push(element);

            this.orderAcknowledgementData.push(element);
            this.orderItems.push(element.order);
            this.userData?.forEach(val => {
              if (element.SubmittedBy == val.id) {
                this.submittedBy = val.EmployeeName;
                element['submittedBy'] = this.submittedBy;
              }
            });

            this.divisionList?.forEach(val => {
              if (element.DivisionId == val.DivisionId) {
                this.divisionName = val.Abbr;

                element['divisionName'] = this.divisionName;
              }
            });

            this.pmList?.forEach(val => {
              if (element.ProjectManagerId == val.PMId) {
                this.pmName = val.EmployeeName;
                this.buHead = val.BUHead;

                element['pmName'] = this.pmName;
                element['buHead'] = this.buHead;
              }
            });

            this.regionList?.forEach(val => {
              if (element.RegionId == val.RegionId) {
                this.regionName = val.RegionName;
                element['regionName'] = this.regionName;
              }
            });

            this.categoryList?.forEach(val => {
              if (element.CategoryId == val.CategoryId) {
                this.categoryName = val.CategoryName;
                element['categoryName'] = this.categoryName;
              }
            });

            this.proformaList?.forEach(val => {
              if (element.ProformaID == val.ProformaID) {

                this.docNo = val.DocNo;
                element['docNo'] = this.docNo;

                //add by gautam
                this.poNo = val.PONo;
                element['poNo'] = this.poNo;

                this.poDate = val.PoDate;
                element['poDate'] = this.poDate;
                //end

                this.customerCode = '';
                this.customerName = '';

                if (element.Party_Address == 'soldtoparty') {
                  this.customerCode = val.SoldtoCode;
                  // this.customerCode = this.customerCode.replace(/[^\w\s]/gi, '')
                  let splitting = this.customerCode.slice(7, -3);
                  this.customerCode = splitting;
                  element['customerCode'] = this.customerCode;

                  let string = val.SoldToAddress;
                  string = string.replace(/[\u000b]/g, ",");
                  string = string.split(",");
                  this.customerName = string[0];
                  element['customerName'] = this.customerName;
                }
                else if (element.Party_Address == 'shiptoparty') {
                  this.customerCode = val.Shiptocode;
                  // this.customerCode = this.customerCode.replace(/[^\w\s]/gi, '')
                  let splitting = this.customerCode.slice(7, -3);
                  this.customerCode = splitting;
                  element['customerCode'] = this.customerCode;

                  let string = val.Shiptoaddress;
                  string = string.replace(/[\u000b]/g, ",");
                  string = string.split(",");
                  this.customerName = string[0];
                  element['customerName'] = this.customerName;
                }
                else if (element.Party_Address == 'enduseraddress') {
                  this.customerCode = val.EndUserCode;
                  // this.customerCode = this.customerCode.replace(/[^\w\s]/gi, '')
                  let splitting = this.customerCode.slice(7, -3);
                  this.customerCode = splitting;
                  element['customerCode'] = this.customerCode;

                  let string = val.EndUserAddress;
                  string = string.replace(/[\u000b]/g, ",");
                  string = string.split(",");
                  this.customerName = string[0];
                  element['customerName'] = this.customerName;
                }
                else if (element.Party_Address == 'billtoparty') {
                  this.customerCode = val.Billtocode;
                  // this.customerCode = this.customerCode.replace(/[^\w\s]/gi, '')
                  let splitting = this.customerCode.slice(7, -3);
                  this.customerCode = splitting;
                  element['customerCode'] = this.customerCode;

                  let string = val.Billtoaddress;
                  string = string.replace(/[\u000b]/g, ",");
                  string = string.split(",");
                  this.customerName = string[0];
                  element['customerName'] = this.customerName;
                }

                let submitDate = element.SubmittedDate;
                this.submitDate = moment(submitDate).format("DD-MM-YYYY");
                element['mdate'] = moment(submitDate).format("MMM-YYYY");
                element['subdate'] = moment(submitDate).format("DD-MM-YYYY");


                this.piCode = element.PI_CODE;

                let paymentTerms = element.order;
                if (paymentTerms.length != 0) {
                  if (element.order[0]?.Type == "A" || element.order[0]?.Type == "R") {
                    element['PaymentTerms'] = paymentTerms[0].PaymentTerms;
                  } else {
                    if (val.PaymentTerms != null) {
                      element['PaymentTerms'] = val.PaymentTerms;
                    } else {
                      element['PaymentTerms'] = "";
                    }
                  }
                }



                let unitType = val.items && val.items.length > 0 ? val.items[0].UnitType : null;

                this.pivalue_inr = 0;
                this.pivalue_usd = 0;
                this.pivalue_bdt = 0;

                if (unitType == "INR") {
                  this.pivalue_inr = element.TotalAmountWithTCS;
                  element['pi_value_inr'] = element.TotalAmountWithTCS;
                }
                else if (unitType == "USD") {
                  this.pivalue_usd = element.TotalAmountWithTCS;
                  element['pi_value_usd'] = element.TotalAmountWithTCS;
                }
                else if (unitType == "BDT") {
                  this.pivalue_bdt = element.TotalAmountWithTCS;
                  element['pi_value_bdt'] = element.TotalAmountWithTCS;
                }

              }
            });

            this.dataSource.sort = this.sort;

            let arr = [];
            for (let items of this.orderItems[index]) {
              arr.push(items.Description);
            }




            this.dataArray.push([{
              // submittedBy: this.submittedBy == undefined || null ? null : this.submittedBy,
              divisionName: this.divisionName == undefined || null ? null : this.divisionName,
              buHead: this.buHead == undefined || null ? null : this.buHead,
              pmName: this.pmName == undefined || null ? null : this.pmName,
              regionName: this.regionName == undefined || null ? null : this.regionName,
              categoryName: this.categoryName == undefined || null ? null : this.categoryName,
              docNo: this.docNo == undefined || null ? null : this.docNo,
              //add by gautam
              poNo: this.poNo == undefined || null ? null : this.poNo,
              poDate: this.poDate == undefined || null ? null : this.poDate,
              //end
              pi_no: this.piCode == undefined || null ? null : this.piCode,
              customerCode: this.customerCode == undefined || null ? null : this.customerCode,
              customerName: this.customerName == undefined || null ? null : this.customerName,
              submitDate: this.submitDate == undefined || null ? null : this.submitDate,
              pi_value_inr: this.pivalue_inr == undefined || null ? 0 : this.pivalue_inr,
              pi_value_usd: this.pivalue_usd == undefined || null ? 0 : this.pivalue_usd,
              pi_value_bdt: this.pivalue_bdt == undefined || null ? 0 : this.pivalue_bdt,
              description: arr == undefined || null ? null : arr,
              // balance_value : element.TotalAmountWithTCS == undefined || null ? null : element.TotalAmountWithTCS,
              balance_value: 0,
              pi_advance: element.Advance == null || undefined ? 0 : element.Advance,
              pi_retention: element.Retention == null || undefined ? 0 : element.Retention,
              pi_total: element.TotalAmount == null || undefined ? 0 : element.TotalAmount,
              jobcode: element.JobCode == undefined || null ? null : element.JobCode,
              wbs: element.WBS == undefined || null ? null : element.WBS,
              remarks: element.PI_Remarks == undefined || null ? null : element.PI_Remarks,
              bgno_dt: element.order[0]?.Type == "A" || "R" ? element.order[0]?.APBGDetails == null ? '-' : element.order[0]?.APBGDetails : '-',
              deleted_remarks: element.deleted_remarks == null || undefined || "" ? "" : element.deleted_remarks,
              deleted_pi: element.DeleteFlag == null || undefined || "" || false ? false : true,
              delete_status: element.DeleteFlag == true ? 'Deleted' : '',
              payment_terms: element?.PaymentTerms == null ? "" : element?.PaymentTerms,
              mat_ready_date: element?.MaterialReadinessDate == null ? "" : element?.MaterialReadinessDate
            }]);

          });

        } else {
          this.toastr.error("No records found");
        }
      });
    } else {
      this.getAllOrderItems();
    }
  }


  getAllOrderItems() {
    let Arr = [];
    this.orderAcknowledgementData = [];
    this.orderItems = [];

    let url = 'get_order_ack/';
    this.apiService.getData(url).then((result: any) => {
      if (result.totalRecords != 0) {
        this.dataSource = new MatTableDataSource(result.records);
        this.dataSource.data = result.records;
        this.proformaList = result.proforma;

        this.proformaTable = true;

        this.dataArray = [];

        let data: any = result.records;
        data?.forEach((element, index) => {
          Arr.push(element);

          this.orderAcknowledgementData.push(element);
          this.orderItems.push(element.order);
          this.userData?.forEach(val => {
            if (element.SubmittedBy == val.id) {
              this.submittedBy = val.EmployeeName;
              element['submittedBy'] = this.submittedBy;
            }
          });

          this.divisionList?.forEach(val => {
            if (element.DivisionId == val.DivisionId) {
              this.divisionName = val.Abbr;
              this.buHead = val.BUHead;

              element['divisionName'] = this.divisionName;
              element['buHead'] = this.buHead;
            }
          });

          this.pmList?.forEach(val => {
            if (element.ProjectManagerId == val.PMId) {
              this.pmName = val.EmployeeName;
              this.buHead = val.BUHead;

              element['pmName'] = this.pmName;
              element['buHead'] = this.buHead;

            }
          });

          this.regionList?.forEach(val => {
            if (element.RegionId == val.RegionId) {
              this.regionName = val.RegionName;
              element['regionName'] = val.RegionName;
            }
          });

          this.categoryList?.forEach(val => {
            if (element.CategoryId == val.CategoryId) {
              this.categoryName = val.CategoryName;
              element['categoryName'] = this.categoryName;
            }
          });


          this.proformaList?.forEach(val => {
            if (element.ProformaID == val.ProformaID) {

              this.docNo = val.DocNo;

              this.customerCode = '';
              this.customerName = '';

              if (element.Party_Address == 'soldtoparty') {
                this.customerCode = val.SoldtoCode;
                // this.customerCode = this.customerCode.replace(/[^\w\s]/gi, '')
                let splitting = this.customerCode.slice(7, -3);
                this.customerCode = splitting;
                element['customerCode'] = this.customerCode;

                let string = val.SoldToAddress;
                string = string.replace(/[\u000b]/g, ",");
                string = string.split(",");
                this.customerName = string[0];
                element['customerName'] = this.customerName;
              }
              else if (element.Party_Address == 'shiptoparty') {
                this.customerCode = val.Shiptocode;
                // this.customerCode = this.customerCode.replace(/[^\w\s]/gi, '')
                let splitting = this.customerCode.slice(7, -3);
                this.customerCode = splitting;
                element['customerCode'] = this.customerCode;

                let string = val.Shiptoaddress;
                string = string.replace(/[\u000b]/g, ",");
                string = string.split(",");
                this.customerName = string[0];
                element['customerName'] = this.customerName;
              }
              else if (element.Party_Address == 'enduseraddress') {
                this.customerCode = val.EndUserCode;
                // this.customerCode = this.customerCode.replace(/[^\w\s]/gi, '')
                let splitting = this.customerCode.slice(7, -3);
                this.customerCode = splitting;
                element['customerCode'] = this.customerCode;

                let string = val.EndUserAddress;
                string = string.replace(/[\u000b]/g, ",");
                string = string.split(",");
                this.customerName = string[0];
                element['customerName'] = this.customerName;
              }
              else if (element.Party_Address == 'billtoparty') {
                this.customerCode = val.Billtocode;
                // this.customerCode = this.customerCode.replace(/[^\w\s]/gi, '')
                let splitting = this.customerCode.slice(7, -3);
                this.customerCode = splitting;
                element['customerCode'] = this.customerCode;

                let string = val.Billtoaddress;
                string = string.replace(/[\u000b]/g, ",");
                string = string.split(",");
                this.customerName = string[0];
                element['customerName'] = this.customerName;
              }

              let submitDate = element.SubmittedDate;
              this.submitDate = moment(submitDate).format("DD-MM-YYYY");
              element['mdate'] = moment(submitDate).format("MMM-YYYY");
              element['subdate'] = moment(submitDate).format("DD-MM-YYYY");

              this.piCode = element.PI_CODE;

              let paymentTerms = element.order;


              if (paymentTerms.length != 0) {
                if (element.order[0]?.Type == "A" || element.order[0]?.Type == "R") {
                  element['PaymentTerms'] = paymentTerms[0].PaymentTerms;
                } else {
                  if (val.PaymentTerms != null) {
                    element['PaymentTerms'] = val.PaymentTerms;
                  } else {
                    element['PaymentTerms'] = "";
                  }
                }
              }

              let unitType = val.items[0].UnitType;

              this.pivalue_inr = 0;
              this.pivalue_usd = 0;
              this.pivalue_bdt = 0;

              if (unitType == "INR") {
                this.pivalue_inr = element.TotalAmountWithTCS;
                element['pi_value_inr'] = element.TotalAmountWithTCS;
              }
              else if (unitType == "USD") {
                this.pivalue_usd = element.TotalAmountWithTCS;
                element['pi_value_usd'] = element.TotalAmountWithTCS;
              }
              else if (unitType == "BDT") {
                this.pivalue_bdt = element.TotalAmountWithTCS;
                element['pi_value_bdt'] = element.TotalAmountWithTCS;
              }

            }
          });

          this.dataSource.sort = this.sort;

          let arr = [];
          for (let items of this.orderItems[index]) {
            arr.push(items.Description);
          }



          this.dataArray.push([{
            // submittedBy: this.submittedBy == undefined || null ? null : this.submittedBy,
            divisionName: this.divisionName == undefined || null ? null : this.divisionName,
            buHead: this.buHead == undefined || null ? null : this.buHead,
            pmName: this.pmName == undefined || null ? null : this.pmName,
            regionName: this.regionName == undefined || null ? null : this.regionName,
            categoryName: this.categoryName == undefined || null ? null : this.categoryName,
            docNo: this.docNo == undefined || null ? null : this.docNo,
            // pi_no: this.docNo + '-' + element.RevNo == undefined || null ? null :  this.docNo ,
            pi_no: this.piCode == undefined || null ? null : this.piCode,
            customerCode: this.customerCode == undefined || null ? null : this.customerCode,
            customerName: this.customerName == undefined || null ? null : this.customerName,
            submitDate: this.submitDate == undefined || null ? null : this.submitDate,
            pi_value_inr: this.pivalue_inr == undefined || null ? 0 : this.pivalue_inr,
            pi_value_usd: this.pivalue_usd == undefined || null ? 0 : this.pivalue_usd,
            pi_value_bdt: this.pivalue_bdt == undefined || null ? 0 : this.pivalue_bdt,
            description: arr == undefined || null ? null : arr,
            // balance_value : element.TotalAmountWithTCS == undefined || null ? null : element.TotalAmountWithTCS,
            balance_value: 0,
            pi_advance: element.Advance == null || undefined ? 0 : element.Advance,
            pi_retention: element.Retention == null || undefined ? 0 : element.Retention,
            pi_total: element.TotalAmount == null || undefined ? 0 : element.TotalAmount,
            jobcode: element.JobCode == undefined || null ? null : element.JobCode,
            wbs: element.WBS == undefined || null ? null : element.WBS,
            remarks: element.PI_Remarks == undefined || null ? null : element.PI_Remarks,
            bgno_dt: element.order[0]?.Type == "A" || "R" ? element.order[0]?.APBGDetails == null ? '-' : element.order[0]?.APBGDetails : '-',
            deleted_remarks: "",
            deleted_pi: false,
            delete_status: "",
            payment_terms: element?.PaymentTerms == null ? "" : element?.PaymentTerms,
            mat_ready_date: element?.MaterialReadinessDate == null ? "" : element?.MaterialReadinessDate
          }]);

        });


      } else {
        this.toastr.error("No records found");
      }
    });
  }

  exportToExcel() {

    let data = [];

    if (this.dataArray.length == 0) {

      this.toastr.error("Sorry!!! No Data");

    } else {

      this.dataArray.forEach((element, index) => {
        data.push(element[0]);
      });
      

      let url = 'get_order_ack/proforma_report_list/';
      this.apiService.postData(url, data).then((result: any) => {
        this.fileDownload();
      });
    }
  }

  fileDownload() {
    let url = "get_order_ack/download_report/"
    this.apiService.download(url).subscribe((response) => {
      let blob = new Blob([response], { type: response.type })
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'proforma_report');
      link.click();
    })
  }


  // getProformaDetails(){
  //   let url = "proforma_master_list/"
  //   this.apiService.getData(url).then((result: any) => {
  //     this.proformaList = result.records;
  //   });
  // }



  getUserData() {
    let url = "user_list/"
    this.apiService.getData(url).then((result: any) => {
      this.userData = result.records;
    });
  }


  generatePDF(element, index, type) {
    if (type == "print_with_logo") {

      let url = "get_order_ack/print_with_logo/" + this.orderAcknowledgementData[index].OrderAckId;
      this.apiService.downloadPDF(url).then((data) => {
        var downloadURL = window.URL.createObjectURL(data);
        let tab = window.open();
        tab.location.href = downloadURL;
      });

    } else if (type == "print_without_logo") {

      let url = "get_order_ack/print_without_logo/" + this.orderAcknowledgementData[index].OrderAckId;
      this.apiService.downloadPDF(url).then((data) => {

        var downloadURL = window.URL.createObjectURL(data);
        // var link = document.createElement('a');
        let tab = window.open();
        tab.location.href = downloadURL;
        // link.href = downloadURL;
        // link.download = "Invoice_without_logo.pdf";
        // link.target = '_blank'
        // link.click();

      });

    }
  }


}
