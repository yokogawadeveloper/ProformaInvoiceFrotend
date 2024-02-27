import { Component, OnInit, HostListener, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

import { saveAs } from "file-saver";

import { ViewportScroller } from '@angular/common';

import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../apihandler/api.service';

import { DatePipe } from '@angular/common';

import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { StorageServiceService } from "../storageService/storage.service"

import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import swal from 'sweetalert2';



@Component({
  selector: 'app-proforma-view',
  templateUrl: './proforma-view.component.html',
  styleUrls: ['./proforma-view.component.css'],
})
export class ProformaViewComponent implements OnInit {

  pageYoffset = 0;
  orderAckID: any;
  totalValueWithoutAdvanceRetention: any = 0;
  pi_code: any;
  discounttotalamt: number;
  pftotalamount: any;
  freighttotalAmount: number;

  @HostListener('window:scroll', ['$event']) onScroll(event) {
    this.pageYoffset = window.pageYOffset;
  }

  public displayedColumns = ['slno', 'item_no', 'material_desc', 'part_name', 'qty', 'uom', 'unit_price',
    'total_price', 'pi_qty', 'discount_val', 'p_f', 'freight_amt', 'sgst_amt', 'cgst',
    'igst_Amt', 'total_Amt'];

  public dataSource = new MatTableDataSource<['']>();
  public selection = new SelectionModel<['']>(true, []);

  public displayedColumns1 = ['slno', 'prepared_by', 'type', 'description', 'part_name', 'hsn', 'qty',
    'uom', 'total', 'submitted_date', 'print', 'print_logo', 'print_sbi_bank', 'print_oaitem', 'edit', 'delete'];

  public dataSource1 = new MatTableDataSource<['']>();

  show: boolean = true;

  proformaId: any;

  isLoadingResults = true;

  selectview = 'material';
  dataElement: any;

  dataSelected: any = [];
  supplierText: any;
  dataItems: any;
  submitBtn: any;
  soldToAddress: any;

  quantities: any = [];

  advance: any = 0;
  retention: any = 0;
  materialDate: any = '';
  freight: any = 0;

  divisionValue: any = '';
  categoryValue: any = '';
  regionValue: any = '';
  pmValue: any = '';
  jobcodeValue: any = '';
  dueDaysValue: any = '';
  wbsValue: any = '';
  remarksValue: any = '';

  public orderAckForm: FormGroup;
  public orderAckHistoryForm: FormGroup;

  public order_data: any;
  public order_his_data: any = [];

  divisionList: any;
  categoryList: any;
  regionList: any;
  projectManagerList: any;

  duedays: any = [];
  orderAck: any;
  lineItemType: string = '';

  paymentTerms: any = '';
  inputDescription: any = '';
  percentOnAmt: any = '';
  apbgDetails: any = '';

  gstBaseVal: any = 0;
  gstVal: any = 0;
  click: any = false;
  tcsPercent: any = 0.075;
  tcsValue: any = 0;
  totalValue: any = 0;

  isEnable: boolean = false;
  isDisable: boolean = true;
  isEnableorDisable: boolean = false;
  totalAmount: any = 0;
  totalFreight: any = 0;
  igstAmount: any = 0;
  discountAmount: any;
  PFAmount: any;
  freightAmount: any;

  public piQTY: any = {};
  piQTYTotal: any = [];
  totalValueWithGST: any = [];
  totalPriceWithoutGST: any = [];
  totalGST: any = [];
  igstTotalAmount: any = [];
  sgstTotalAmount: any = [];
  cgstTotalAmount: any = [];
  freightTotalAmount: any = [];
  pfTotalAmount: any = [];
  discountTotal: any = [];

  piQtyShow: boolean = false;

  radioYes: any;
  radioNo: any;

  advanceGSTInput: any = '';
  advanceSGST: any = 0;
  advanceCGST: any = 0;
  advanceIGST: any = 0;

  selectQTY: any = 0;
  inputUOM: string = '';
  inputUnitPrice: any = 0;

  PI_DueDays: any = "";
  PI_DueDate: any = "";

  selectAddress: any = "soldtoparty";
  orderItems: any = [];
  orderAcknowledgementData: any = [];

  advanceSGSTWithGSTBaseValue: any = 0;
  advanceCGSTWithGSTBaseValue: any = 0;
  advanceIGSTWithGSTBaseValue: any = 0;

  userData: any;
  submittedBy: any;
  totalAmountWithGST: any = 0;
  totalUnitPrice: any = 0;
  orderRowDisable: boolean = false;

  obj: any = {};
  basedonItemno: boolean;
  itemIndex: any = '';
  igsttotalamt: number;
  cgsttotalamt: number;
  sgsttotalamt: number;
  divisionAbbr: any = "";
  regionAbbr: any = "";
  newPIcode: any = "";
  categoryId: any;
  divisionId: any;
  PMId: any;
  regionId: any;

  bankAcc: any = '';
  bankIFSC: any = '';
  bank_address: any = '';
  bank_acc_name: any = '';

  partyAddress: any;

  flagType: any;
  btnType: any = "";

  seletedGST: any;

  constructor(
    private activeRoute: ActivatedRoute,
    public apiService: ApiService,
    private toastr: ToastrService,
    public storage: StorageServiceService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private scroll: ViewportScroller
  ) {
    // const dateformat = new DatePipe('en-US').transform(this.materialDate, 'dd-MM-yyyy');
    // console.log(dateformat);
  }

  ngOnInit() {
    this.btnType = "";
    this.proformaId = this.activeRoute.snapshot.params['id'];
    // this.activeRoute.data.subscribe((res: any) => {
    // this.proformaId = res
    // });
    // this.proformaId = this.activeRoute.paramMap.pipe(map(() => window.history.state));

    this.proformaView();
    this.getUserData();

    this.divisionListFunc();
    this.categoryListFunc();
    this.regionListFunc();
    this.projectManagerListFunc();

    this.orderAckForm = new FormGroup({
      ProformaID: new FormControl(),
      Advance: new FormControl(),
      Retention: new FormControl(),
      MaterialReadinessDate: new FormControl(),
      Freight: new FormControl(),
      TotalAmount: new FormControl(),
      DivisionId: new FormControl('', [Validators.required]),
      CategoryId: new FormControl('', [Validators.required]),
      RegionId: new FormControl('', [Validators.required]),
      ProjectManagerId: new FormControl('', [Validators.required]),
      JobCode: new FormControl('', [Validators.required]),
      WBS: new FormControl(),
      TCSApplicable: new FormControl(),
      TCS: new FormControl(),
      TCSAmount: new FormControl(),
      TotalAmountWithTCS: new FormControl(),
      GSTBaseValue: new FormControl(),
      PI_DueDays: new FormControl(),
      PI_DueDate: new FormControl(),
      PI_Remarks: new FormControl()
    });
  }


  proformaView() {

    this.dataItems = [];
    let url = 'proforma_master_list/'

    this.apiService.getData(url + this.proformaId).then((result: any) => {

      if (result.status != false) {
        this.dataElement = result.records;
        this.dataSource = new MatTableDataSource(result.records.items);
        this.dataSource.data = result.records.items;
        this.dataItems = result.records.items;
        let data = result.records;
        this.supplierText = data.Supplier.replace(/[\u000b]/g, " ");
        this.soldToAddress = data.Shiptoaddress.replace(/[\u000b]/g, " ");
        let bool = true;
        this.duplicate_getOrderAcknowledgement(bool);
        this.userData?.forEach(val => {
          if (this.dataElement.SubmittedBy == val.id) {
            this.submittedBy = val.EmployeeName;
          }
        });

        this.dataItems.forEach(element => {
          element['excluded'] = false;
        });
      }

      let indent_no = this.dataElement['IndentNo']
      let indent_char_list = ["D", "H", "J", "K", "V", "M", "E", "B", "N", "U", "C", "P", "G", "L", "S"]
      let sale_office_list = ["Delhi", "Hyderabad", "Bangladesh", "Kolkata", "Vizag", "Mumbai", "Cochin", "Baroda",
        "Nagpur", "Bhutan", "Chennai", "Pune", "Surat", "Bangalore", "Corporate Sales"]

      let sales_office;

      if (indent_no) {
        indent_char_list.forEach((res: any, index: any) => {
          if (indent_no[1].toUpperCase() == res) {
            sales_office = sale_office_list[index]
          }
        });
      }

      this.dataElement['Sales_Office'] = sales_office


      this.totalAmount = 0;

      for (let i = 0; i <= 180; i++) {
        this.duedays.push(i)
      }

      this.dataSource.data.forEach((element: any, index) => {
        this.totalValueWithGST[index] = element.ItemValuewithGST;
        this.igstTotalAmount[index] = element.IGSTAmount;
        this.sgstTotalAmount[index] = element.SGSTAmount;
        this.cgstTotalAmount[index] = element.CGSTAmount;
        this.freightTotalAmount[index] = element.FreightAmount;
        this.pfTotalAmount[index] = element.PFAmount;
        this.discountTotal[index] = element.DiscountAmount;

        this.piQTY[index] = element.Qtymodels;

        this.totalPriceWithoutGST[index] = element.ItemValuewithPF;

        this.totalAmount += element.ItemValuewithGST;
      });

    });
  }


  divisionListFunc() {
    let url = 'division_master_list/'
    this.apiService.getData(url).then((result: any) => {
      this.divisionList = result.records;
      this.divisionId = this.storage.getDivision();
      this.divisionList.forEach(element => {
        if (this.divisionId == element.DivisionId) {
          this.divisionValue = element.DivisionId;
          element['isSelected'] = true;
        } else {
          element['isSelected'] = false;
        }
      });
    });
  }

  categoryListFunc() {
    let url = 'category_master_list/'
    this.apiService.getData(url).then((result: any) => {
      this.categoryList = result.records;
      this.categoryId = this.storage.getCategory();
      this.categoryList.forEach(element => {
        if (this.categoryId == element.CategoryId) {
          this.categoryValue = element.CategoryId;
          element['isSelected'] = true;
        } else {
          element['isSelected'] = false;
        }
      });
    });
  }

  regionListFunc() {
    let url = 'region_master_list/'
    this.apiService.getData(url).then((result: any) => {
      this.regionList = result.records;
      this.regionId = this.storage.getRegion();
      this.regionList.forEach(element => {
        if (this.regionId == element.RegionId) {
          this.regionValue = element.RegionId;
          element['isSelected'] = true;
        } else {
          element['isSelected'] = false;
        }
      });
    });
  }

  projectManagerListFunc() {
    let url = 'projectmanager_master_list/'
    this.apiService.getData(url).then((result: any) => {
      this.projectManagerList = result.records;
      this.PMId = this.storage.getprojectManager();
      this.projectManagerList.forEach(element => {
        if (this.PMId == element.PMId) {
          this.pmValue = element.PMId;
          element['isSelected'] = true;
        } else {
          element['isSelected'] = false;
        }
      });
    });
  }

  PIDueDays(val) {

    const d = moment();
    var PIDueDate: any = moment(d).add(val.target.value, 'days').format('DD-MM-YYYY');

    this.PI_DueDate = PIDueDate;
    this.PI_DueDays = val.target.value;
  }


  onSelectchange(val) {
    this.selectview = val;
    this.displayedColumns = ['select', 'slno', 'item_no', 'material_desc', 'part_name', 'qty', 'uom',
      'unit_price', 'total_price', 'pi_qty', 'discount_val', 'p_f', 'freight_amt', 'sgst_amt', 'cgst',
      'igst_Amt', 'total_Amt'];
    this.submitBtn = val;

    for (let i = 0; i <= 150; i++) {
      this.quantities.push(i)
    }

    if (val == 'material') {
      this.lineItemType = 'M';

      this.gstVal = 0;
      this.totalValue = 0;
      this.tcsValue = 0;
      this.advance = 0;
      this.retention = 0;
      this.freight = 0;
      this.click = false;

      this.gstBaseVal = 0;

      this.inputDescription = "";
      this.percentOnAmt = "";
      this.apbgDetails = "";
      this.selectQTY = 0;
      this.inputUOM = "";
      this.inputUnitPrice = 0;

      this.advanceSGST = 0;
      this.advanceCGST = 0;
      this.advanceIGST = 0;

      this.isEnable = false;
      this.isDisable = true;
    }
    else if (val == 'advance') {
      this.lineItemType = 'A';
      this.advanceGSTInput = '';

      this.gstVal = 0;
      this.totalValue = 0;
      this.tcsValue = 0;
      this.advance = 0;
      this.retention = 0;
      this.freight = 0;
      this.click = false;

      this.gstBaseVal = 0;

      this.inputDescription = "";
      this.percentOnAmt = "";
      this.apbgDetails = "";
      this.selectQTY = 0;
      this.inputUOM = "";
      this.inputUnitPrice = 0;

      this.advanceSGST = 0;
      this.advanceCGST = 0;
      this.advanceIGST = 0;

      this.isEnable = true;
      this.isDisable = false;
    }
    else if (val == 'retention') {
      this.lineItemType = 'R';

      this.gstVal = 0;
      this.totalValue = 0;
      this.tcsValue = 0;
      this.advance = 0;
      this.retention = 0;
      this.freight = 0;
      this.click = false;

      this.gstBaseVal = 0;

      this.inputDescription = "";
      this.percentOnAmt = "";
      this.apbgDetails = "";
      this.selectQTY = 0;
      this.inputUOM = "";
      this.inputUnitPrice = 0;

      this.advanceSGST = 0;
      this.advanceCGST = 0;
      this.advanceIGST = 0;

      this.isEnable = true;
      this.isDisable = true;
    }

  }

  // Mat-table checkbox selection

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    // const numRows = this.dataSource.data.length;
    this.dataSource.data.filter((row: any, index: any) => {
      row['indexPosition'] = index;
    })

    const numRowsMinusExcluded = this.dataSource.data.filter((row: any) => !row.excluded).length;

    return numSelected === numRowsMinusExcluded;
  }

  masterToggle() {

    if (this.isAllSelected() == false) {
      this.isAllSelected() ? this.selection.clear() :
        this.dataSource.data.forEach((row: any, index) => {
          // this.selection.select(row);

          if (!row.excluded) {
            this.selection.select(row);
          }
          row['check'] = true;
          this.basedonPIQty(index);
        });
    } else {

      this.selection.clear();

      if (this.selection.selected.length == 0) {
        this.dataSource.data.forEach((row, index) => {
          row['check'] = false;
          this.piQTY[index] = this.dataItems[index].Qtymodels;
          this.advance = 0;
          this.retention = 0;
          this.freight = 0;
          this.totalValue = 0;
          this.click = false;
          // this.basedonPIQty(index);
          let bool = false;
          this.duplicate_getOrderAcknowledgement(bool);
        });
      }
    }
  }


  // Input fields of Advance, Retention, MaterialDate and Freight

  lineItemValues(type, val) {

    if (type == 'advance') {
      this.advance = val.target.value;
    }
    else if (type == 'retention') {
      this.retention = val.target.value;
    }
    else if (type == 'materialDate') {
      this.materialDate = val.target.value;
    }
    else if (type == 'freight') {
      this.freight = val.target.value;
      if (this.freight == 0 || this.freight == null) {
        this.gstVal = 0;
      }
    }

    this.onCalculation();

  }

  // PI Qty input showing in the table

  piQTYShow(row, check, index) {

    check ? this.selection.toggle(row) : null;


    if (check.checked == true) {
      row['check'] = true;
      this.basedonPIQty(index);
    } else {
      row['check'] = false;
      this.piQTY[index] = this.dataItems[index].Qtymodels;
      this.advance = 0;
      this.retention = 0;
      this.freight = 0;
      this.click = false;
      this.radioNo;
      this.basedonPIQty(index);
      let bool = false;
      if (this.btnType != "edit") {
        this.duplicate_getOrderAcknowledgement(bool);
      }
    }
  }

  calculationBasedonItemno(index, val) {

    let totalQty_value: any = 0;

    let discountAmt: any = 0;
    let pfPercentAmt: any = 0;
    let freightAmt: any = 0;
    let cgstAmt: any = 0;
    let sgstAmt: any = 0;
    let igstAmt: any = 0;

    if (val == 'unitprice') {

      if (this.dataItems[index].Qtymodels < this.piQTY[index]) {

        this.toastr.error("Qty value is larger than actual Qty value");

        this.piQTY[index] = this.dataItems[index].Qtymodels;

        totalQty_value = this.dataItems[index].ItemValuewithGST;
        this.igstTotalAmount[index] = this.dataItems[index].IGSTAmount;
        this.sgstTotalAmount[index] = this.dataItems[index].SGSTAmount;
        this.cgstTotalAmount[index] = this.dataItems[index].CGSTAmount;
        this.freightTotalAmount[index] = this.dataItems[index].FreightAmount;
        this.pfTotalAmount[index] = this.dataItems[index].PFAmount;
        this.discountTotal[index] = this.dataItems[index].DiscountAmount;

      } else {

        totalQty_value = (parseFloat(this.piQTY[index]) * parseFloat(this.dataItems[index].UnitPrice)).toFixed(2);
        // this.piQTYTotal[index] = totalQty_value;

        if (this.piQTY[index] == null) {
          totalQty_value = (parseFloat(this.dataItems[index].Qtymodels) * parseFloat(this.dataItems[index].UnitPrice)).toFixed(2);
          this.piQTYTotal[index] = totalQty_value;
        }

        this.totalValueWithGST[index] = totalQty_value;

        this.totalAmount = 0;
        for (let i of this.totalValueWithGST) {
          let val = i
          let float = parseFloat(val);
          if (float !== float) {
            float = 0;
          }
          this.totalAmount = this.totalAmount + float;
        }

        this.basedonItemno = true;
        this.itemIndex = index;

        this.onCalculation();
      }

    } else if (val == 'totalprice') {

      if (this.dataItems[index].UnitPrice == null) {
        this.dataItems[index].UnitPrice = 0;
      }

      if (this.dataItems[index].DiscountPercent != 0 && this.dataItems[index].DiscountPercent != null) {
        discountAmt = ((parseFloat(this.dataItems[index].DiscountPercent) * totalQty_value) / 100).toFixed(2);
        this.discountTotal[this.itemIndex] = discountAmt;
      }
      if (this.dataItems[index].PFpercent != 0 && this.dataItems[index].PFpercent != null) {
        pfPercentAmt = ((parseFloat(this.dataItems[index].PFpercent) * totalQty_value) / 100).toFixed(2);
        this.pfTotalAmount[this.itemIndex] = pfPercentAmt;
      }
      if (this.dataItems[index].FreightPercent != 0 && this.dataItems[index].FreightPercent != null) {
        freightAmt = ((parseFloat(this.dataItems[index].FreightPercent) * totalQty_value) / 100).toFixed(2);
        this.freightTotalAmount[this.itemIndex] = freightAmt;
      }

      totalQty_value = (parseFloat(totalQty_value) - parseFloat(discountAmt == null ? 0 : discountAmt));
      totalQty_value = (parseFloat(totalQty_value) + parseFloat(pfPercentAmt == null ? 0 : pfPercentAmt) + parseFloat(freightAmt == null ? 0 : freightAmt));
      this.totalPriceWithoutGST[this.itemIndex] = parseFloat(totalQty_value).toFixed(2);

      if (this.dataItems[index].CGSTPercent != 0 && this.dataItems[index].SGSTpercent != 0 && this.dataItems[index].CGSTPercent != null && this.dataItems[index].SGSTpercent != null) {
        cgstAmt = ((parseFloat(this.dataItems[index].CGSTPercent) * totalQty_value) / 100).toFixed(2);
        sgstAmt = ((parseFloat(this.dataItems[index].SGSTpercent) * totalQty_value) / 100).toFixed(2);
        this.cgstTotalAmount[this.itemIndex] = cgstAmt;
        this.sgstTotalAmount[this.itemIndex] = sgstAmt;
        this.totalGST[this.itemIndex] = (parseFloat(cgstAmt) + parseFloat(sgstAmt)).toFixed(2);
        totalQty_value = (parseFloat(totalQty_value) + parseFloat(cgstAmt) + parseFloat(sgstAmt)).toFixed(2);
      } else if (this.dataItems[index].IGSTPercent != 0 && this.dataItems[index].IGSTPercent != null) {
        igstAmt = ((parseFloat(this.dataItems[index].IGSTPercent) * totalQty_value) / 100).toFixed(2);
        this.igstTotalAmount[this.itemIndex] = igstAmt;
        this.totalGST[this.itemIndex] = igstAmt;
        totalQty_value = (parseFloat(totalQty_value) + parseFloat(igstAmt)).toFixed(2);
      }

      this.totalValueWithGST[this.itemIndex] = totalQty_value;

      this.totalAmount = 0;
      for (let i of this.totalValueWithGST) {
        let val = i
        let float = parseFloat(val);
        if (float !== float) {
          float = 0;
        }
        this.totalAmount = this.totalAmount + float;
      }

      this.onCalculation();

    }

  }


  // LineItem PI Qty calculations

  basedonPIQty(index) {


    if (this.dataItems[index].ItemNo != null && this.dataItems[index].ItemValuewithGST == null) {

      this.calculationBasedonItemno(index, 'unitprice');

    } else if (this.dataItems[index].ItemNo == null && this.dataItems[index].ItemValuewithGST != null) {

      this.calculationBasedonItemno(index, 'totalprice');

    } else {

      if (this.dataItems[index].UnitPrice == null) {
        this.dataItems[index].UnitPrice = 0;
      }

      let totalQty_value: any = 0;

      if (this.dataItems[index].Qtymodels < this.piQTY[index]) {

        if (this.btnType != 'edit') {
          this.toastr.error("Qty value is larger than actual Qty value");
        }

        this.piQTY[index] = this.dataItems[index].Qtymodels;

        totalQty_value = this.dataItems[index].ItemValuewithGST;
        this.igstTotalAmount[index] = this.dataItems[index].IGSTAmount;
        this.sgstTotalAmount[index] = this.dataItems[index].SGSTAmount;
        this.cgstTotalAmount[index] = this.dataItems[index].CGSTAmount;
        this.freightTotalAmount[index] = this.dataItems[index].FreightAmount;
        this.pfTotalAmount[index] = this.dataItems[index].PFAmount;
        this.discountTotal[index] = this.dataItems[index].DiscountAmount;

      } else {

        let discountAmt: any = 0;
        let pfPercentAmt: any = 0;
        let freightAmt: any = 0;
        let cgstAmt: any = 0;
        let sgstAmt: any = 0;
        let igstAmt: any = 0;
        let unitAmt: any = 0;

        if (this.piQTY[index] == null) {

          totalQty_value = (parseFloat(this.dataItems[index].Qtymodels) * parseFloat(this.dataItems[index].UnitPrice)).toFixed(2);
          this.piQTYTotal[index] = totalQty_value;
          unitAmt = totalQty_value;
          // this.piQTY[index] = parseFloat(this.dataItems[index].Qtymodels);

          if (this.dataItems[index].DiscountPercent != 0 && this.dataItems[index].DiscountPercent != null) {
            discountAmt = ((parseFloat(this.dataItems[index].DiscountPercent) * unitAmt) / 100).toFixed(2);
            this.discountTotal[index] = discountAmt;
            totalQty_value = (parseFloat(totalQty_value) - parseFloat(this.discountTotal[index] == null ? 0 : this.discountTotal[index]));
          } else if (this.discountTotal[index] != 0 && this.discountTotal[index] != null) {
            totalQty_value = (parseFloat(totalQty_value) - parseFloat(this.discountTotal[index] == null ? 0 : this.discountTotal[index]));
          }

          if (this.dataItems[index].PFpercent != 0 && this.dataItems[index].PFpercent != null) {
            pfPercentAmt = ((parseFloat(this.dataItems[index].PFpercent) * totalQty_value) / 100).toFixed(2);
            this.pfTotalAmount[index] = pfPercentAmt;
            totalQty_value = (parseFloat(totalQty_value) + parseFloat(this.pfTotalAmount[index] == null ? 0 : this.pfTotalAmount[index]));
            this.totalPriceWithoutGST[index] = parseFloat(totalQty_value).toFixed(2);
          } else if (this.pfTotalAmount[index] != 0 && this.pfTotalAmount[index] != null) {
            totalQty_value = (parseFloat(totalQty_value) - parseFloat(this.pfTotalAmount[index] == null ? 0 : this.pfTotalAmount[index]));
            this.totalPriceWithoutGST[index] = parseFloat(totalQty_value).toFixed(2);
          }


          if (this.dataItems[index].FreightPercent != 0 && this.dataItems[index].FreightPercent != null) {
            freightAmt = ((parseFloat(this.dataItems[index].FreightPercent) * parseFloat(unitAmt)) / 100).toFixed(2);
            this.freightTotalAmount[index] = freightAmt;
            totalQty_value = (parseFloat(totalQty_value) + parseFloat(this.freightTotalAmount[index] == null ? 0 : this.freightTotalAmount[index]));
            this.totalPriceWithoutGST[index] = parseFloat(totalQty_value).toFixed(2);
          } else if (this.freightTotalAmount[index] != 0 && this.freightTotalAmount[index] != null) {
            totalQty_value = (parseFloat(totalQty_value) + parseFloat(this.freightTotalAmount[index] == null ? 0 : this.freightTotalAmount[index]));
            this.totalPriceWithoutGST[index] = parseFloat(totalQty_value).toFixed(2);
          }


          if (this.dataItems[index].CGSTPercent != 0 && this.dataItems[index].SGSTpercent != 0 && this.dataItems[index].CGSTPercent != null && this.dataItems[index].SGSTpercent != null) {
            cgstAmt = ((parseFloat(this.dataItems[index].CGSTPercent) * totalQty_value) / 100).toFixed(2);
            sgstAmt = ((parseFloat(this.dataItems[index].SGSTpercent) * totalQty_value) / 100).toFixed(2);
            this.cgstTotalAmount[index] = cgstAmt;
            this.sgstTotalAmount[index] = sgstAmt;
            this.totalGST[index] = (parseFloat(cgstAmt) + parseFloat(sgstAmt)).toFixed(2);
            totalQty_value = (parseFloat(totalQty_value) + parseFloat(cgstAmt) + parseFloat(sgstAmt)).toFixed(2);
          } else if (this.dataItems[index].IGSTPercent != 0 && this.dataItems[index].IGSTPercent != null) {
            igstAmt = ((parseFloat(this.dataItems[index].IGSTPercent) * totalQty_value) / 100).toFixed(2);
            this.igstTotalAmount[index] = igstAmt;
            this.totalGST[index] = igstAmt;
            totalQty_value = (parseFloat(totalQty_value) + parseFloat(igstAmt)).toFixed(2);
          }

        } else {

          totalQty_value = (parseFloat(this.piQTY[index]) * parseFloat(this.dataItems[index].UnitPrice)).toFixed(2);
          this.piQTYTotal[index] = totalQty_value;
          unitAmt = totalQty_value;

          if (this.dataItems[index].DiscountPercent != 0 && this.dataItems[index].DiscountPercent != null) {
            discountAmt = ((parseFloat(this.dataItems[index].DiscountPercent) * unitAmt) / 100).toFixed(2);
            this.discountTotal[index] = discountAmt;
            discountAmt = this.discountTotal[index];
            totalQty_value = (parseFloat(totalQty_value) - parseFloat(this.discountTotal[index] == null ? 0 : this.discountTotal[index]));
          } else if (this.discountTotal[index] != 0 && this.discountTotal[index] != null) {
            totalQty_value = (parseFloat(totalQty_value) - parseFloat(this.discountTotal[index] == null ? 0 : this.discountTotal[index]));
          }


          if (this.dataItems[index].PFpercent != 0 && this.dataItems[index].PFpercent != null) {
            pfPercentAmt = ((parseFloat(this.dataItems[index].PFpercent) * totalQty_value) / 100).toFixed(2);
            this.pfTotalAmount[index] = pfPercentAmt;
            totalQty_value = (parseFloat(totalQty_value) + parseFloat(this.pfTotalAmount[index] == null ? 0 : this.pfTotalAmount[index]));
            this.totalPriceWithoutGST[index] = parseFloat(totalQty_value).toFixed(2);
          } else if (this.pfTotalAmount[index] != 0 && this.pfTotalAmount[index] != null) {
            totalQty_value = (parseFloat(totalQty_value) - parseFloat(this.pfTotalAmount[index] == null ? 0 : this.pfTotalAmount[index]));
            this.totalPriceWithoutGST[index] = parseFloat(totalQty_value).toFixed(2);
          }



          if (this.dataItems[index].FreightPercent != 0 && this.dataItems[index].FreightPercent != null) {
            freightAmt = ((parseFloat(this.dataItems[index].FreightPercent) * parseFloat(unitAmt)) / 100).toFixed(2);
            this.freightTotalAmount[index] = freightAmt;
            totalQty_value = (parseFloat(totalQty_value) + parseFloat(this.freightTotalAmount[index] == null ? 0 : this.freightTotalAmount[index]));
            this.totalPriceWithoutGST[index] = parseFloat(totalQty_value).toFixed(2);
          } else if (this.freightTotalAmount[index] != 0 && this.freightTotalAmount[index] != null) {
            totalQty_value = (parseFloat(totalQty_value) + parseFloat(this.freightTotalAmount[index] == null ? 0 : this.freightTotalAmount[index]));
            this.totalPriceWithoutGST[index] = parseFloat(totalQty_value).toFixed(2);
          }



          if (this.dataItems[index].CGSTPercent != 0 && this.dataItems[index].SGSTpercent != 0 && this.dataItems[index].CGSTPercent != null && this.dataItems[index].SGSTpercent != null) {
            cgstAmt = ((parseFloat(this.dataItems[index].CGSTPercent) * totalQty_value) / 100).toFixed(2);
            sgstAmt = ((parseFloat(this.dataItems[index].SGSTpercent) * totalQty_value) / 100).toFixed(2);
            this.cgstTotalAmount[index] = cgstAmt;
            this.sgstTotalAmount[index] = sgstAmt;
            this.totalGST[index] = (parseFloat(cgstAmt) + parseFloat(sgstAmt)).toFixed(2);
            totalQty_value = (parseFloat(totalQty_value) + parseFloat(cgstAmt) + parseFloat(sgstAmt)).toFixed(2);
          } else if (this.dataItems[index].IGSTPercent != 0 && this.dataItems[index].IGSTPercent != null) {
            igstAmt = ((parseFloat(this.dataItems[index].IGSTPercent) * totalQty_value) / 100).toFixed(2);
            this.igstTotalAmount[index] = igstAmt;
            this.totalGST[index] = igstAmt;
            totalQty_value = (parseFloat(totalQty_value) + parseFloat(igstAmt)).toFixed(2);
          }
        }
      }


      this.totalValueWithGST[index] = totalQty_value;

      if (this.dataItems[index].ItemNo != null) {

        this.totalAmount = 0;
        for (let i of this.totalValueWithGST) {
          let val = i
          let float = parseFloat(val);
          if (float !== float) {
            float = 0;
          }
          this.totalAmount = this.totalAmount + float;
        }
      }

      this.onCalculation();

    }

  }


  onClick(val) {

    this.click = val.target.checked;
    this.onCalculation();
  }

  // Advance tab Selection

  advanceTabGST(event) {
    if (event.target.value == 'igst') {
      this.advanceGSTInput = event.target.value;
      this.advanceSGST = 0;
      this.advanceCGST = 0;
    } else if (event.target.value == 'gst') {
      this.advanceGSTInput = event.target.value;
      this.advanceIGST = 0;
    } else {
      this.advanceGSTInput = '';
    }

    this.onCalculation();

  }

  onKeyupTCSPercent() {
    if (this.lineItemType == 'A') {
      this.basedOnGSTBaseValue();
    }
    else {
      this.onCalculation();
    }
  }

  // Based on Tables, The Input fields calculation for LineItem

  onCalculation() {

    if (this.lineItemType == 'M') {

      let totalPriceWithGST: any = 0;
      let totalPriceWithoutGST: any = 0;
      let totalUnitPrice: any = 0;
      let totalFreight: any = 0;
      let totalGST: any = 0;
      let addTCSAmount: any = 0;
      let subValue: any = 0;

      let totalValue: any = 0;
      this.tcsValue = 0;
      this.totalValue = 0;
      this.totalFreight = 0;

      let cgst = 0;
      let sgst = 0;
      let igst = 0;

      if (this.selection.selected.length == 0) {

        totalPriceWithGST = 0;
        totalPriceWithoutGST = 0;
        totalUnitPrice = 0;
        totalFreight = 0;
        totalGST = 0;

        cgst = 0;
        sgst = 0;
        igst = 0;

      } else {

        let select = this.selection.selected;
        let data = this.dataItems;

        if (this.basedonItemno == true) {

          data.forEach((element: any, index) => {
            select.forEach((ele: any) => {
              if (element.ProformaItemid == ele.ProformaItemid) {
                totalPriceWithGST += parseFloat(this.totalValueWithGST[index]);
                totalPriceWithoutGST += parseFloat(this.totalPriceWithoutGST[index]);
                totalFreight += parseFloat(this.freightTotalAmount[index]);
                totalGST += parseFloat(this.totalGST[index]);

                // totalUnitPrice += parseFloat(this.piQTYTotal[index]);

                cgst = ele.CGSTPercent;
                sgst = ele.SGSTpercent;
                igst = ele.IGSTPercent;
              }
            });
          });


          totalValue = parseFloat(totalPriceWithGST);
          this.totalValue = totalValue;


          this.totalValueWithoutAdvanceRetention = this.totalValue;

          this.totalAmountWithGST = totalPriceWithGST;
          // this.totalUnitPrice = this.totalAmount;
          this.totalUnitPrice = totalPriceWithoutGST;


        } else {

          data.forEach((element: any, index) => {
            select.forEach((ele: any) => {
              if (element.ProformaItemid == ele.ProformaItemid) {
                totalPriceWithGST += parseFloat(this.totalValueWithGST[index]);
                totalPriceWithoutGST += parseFloat(this.totalPriceWithoutGST[index]);
                totalFreight += parseFloat(this.freightTotalAmount[index]);
                totalGST += parseFloat(this.totalGST[index]);

                totalUnitPrice += parseFloat(this.piQTYTotal[index]);

                cgst = ele.CGSTPercent;
                sgst = ele.SGSTpercent;
                igst = ele.IGSTPercent;
              }
            });
          });
          // totalValue = parseFloat(totalPriceWithoutGST);

          totalValue = parseFloat(totalPriceWithGST);
          this.totalValue = totalValue;

          this.totalValueWithoutAdvanceRetention = this.totalValue;

          this.totalAmountWithGST = totalPriceWithGST;
          // this.totalUnitPrice = totalUnitPrice;

          this.totalUnitPrice = totalPriceWithoutGST;
        }
      }



      if (this.freight != 0) {

        let gstVal: any = 0;
        this.gstVal = 0;

        if (cgst != 0 && cgst != null || sgst != 0 && sgst != null) {
          let gst = cgst + sgst;
          gstVal = (gst * parseFloat(this.freight) / 100);
          this.gstVal = (parseFloat(totalGST) + parseFloat(gstVal)).toFixed(2);

          let total = (parseFloat(this.totalUnitPrice) + parseFloat(this.gstVal)).toFixed(2);
          this.totalValue = (parseFloat(total) + parseFloat(this.freight)).toFixed(2);
        }
        else if (igst != 0 && igst != null) {
          gstVal = (igst * parseFloat(this.freight) / 100);
          this.gstVal = (parseFloat(totalGST) + parseFloat(gstVal)).toFixed(2);

          let total = (parseFloat(this.totalUnitPrice) + parseFloat(this.gstVal)).toFixed(2);
          this.totalValue = (parseFloat(total) + parseFloat(this.freight)).toFixed(2);
        }
        else {
          gstVal = 0;
          this.gstVal = 0;
        }
      }


      if (this.click == true) {
        if (parseInt(this.totalValue) != 0) {
          addTCSAmount = (((parseFloat(this.tcsPercent) * parseFloat(this.totalValue)) / 100)).toFixed(2);
        } else {
          addTCSAmount = 0;
        }
        this.tcsValue = parseFloat(addTCSAmount);
        totalValue += parseFloat(this.tcsValue);
        this.totalValue = parseFloat(this.totalValue) + parseFloat(this.tcsValue);
      } else {
        this.totalValue = parseFloat(this.totalValue) - parseFloat(this.tcsValue);
      }


      this.totalValueWithoutAdvanceRetention = this.totalValue;


      let sub_Adv_Rtn = (parseFloat(this.advance == '' ? 0 : this.advance) + parseFloat(this.retention == '' ? 0 : this.retention)).toFixed(2);
      subValue = (Math.abs(parseFloat(this.totalValue) - parseFloat(sub_Adv_Rtn))).toFixed(2);
      // subValue = (parseFloat(this.freight == '' ? 0 : this.freight) + parseFloat(subValue)).toFixed(2);
      this.totalValue = subValue;

      if (totalFreight !== totalFreight) {
        totalFreight = 0;
      }

      this.totalFreight = (parseFloat(this.freight == '' ? 0 : this.freight) + parseFloat(totalFreight)).toFixed(2);


    }

    else if (this.lineItemType == 'A') {

      let qty_price_value: any = 0;
      let totalGST: any = 0;
      let sgst: any = 0;
      let cgst: any = 0;
      let igst: any = 0;
      let totalValue: any = 0;
      let addTCSAmount: any = 0;

      qty_price_value = (parseFloat(this.selectQTY == null ? 0 : this.selectQTY) *
        parseFloat(this.inputUnitPrice == '' ? 0 : this.inputUnitPrice)).toFixed(2);

      this.gstBaseVal = parseFloat(qty_price_value);



      if (this.advanceGSTInput == 'gst') {

        if (this.advanceSGST != 0 && this.advanceSGST != null || this.advanceCGST != 0 && this.advanceCGST != null) {

          sgst = ((parseFloat(this.gstBaseVal) * parseFloat(this.advanceSGST)) / 100).toFixed(2);
          cgst = ((parseFloat(this.gstBaseVal) * parseFloat(this.advanceCGST)) / 100).toFixed(2);

          this.advanceSGSTWithGSTBaseValue = parseFloat(sgst).toFixed(2);
          this.advanceCGSTWithGSTBaseValue = parseFloat(cgst).toFixed(2);

          totalGST = (parseFloat(sgst) + parseFloat(cgst)).toFixed(2);
        }
      }


      if (this.advanceGSTInput == 'igst') {

        if (this.advanceIGST != 0 && this.advanceIGST != null) {

          igst = ((parseFloat(this.gstBaseVal) * parseFloat(this.advanceIGST)) / 100).toFixed(2);

          this.advanceIGSTWithGSTBaseValue = parseFloat(igst).toFixed(2);

          totalGST = (parseFloat(igst)).toFixed(2);

        }
      }

      this.gstVal = parseFloat(totalGST);
      totalValue = (parseFloat(this.gstBaseVal) + parseFloat(this.gstVal)).toFixed(2);

      if (this.click == true) {
        if (parseInt(totalValue) != 0) {
          addTCSAmount = (((parseFloat(this.tcsPercent) * parseFloat(this.gstBaseVal)) / 100)).toFixed(2);
        } else {
          addTCSAmount = 0;
        }
        this.tcsValue = parseFloat(addTCSAmount);
        totalValue = (parseFloat(this.tcsValue) + parseFloat(totalValue)).toFixed(2);
      } else {
        this.tcsValue = 0;
      }

      this.totalValue = parseFloat(totalValue).toFixed(2);

    }

    else if (this.lineItemType == 'R') {

      let qty_price_value: any = 0;
      let totalValue: any = 0;
      let addTCSAmount: any = 0;

      qty_price_value = (parseFloat(this.selectQTY == null ? 0 : this.selectQTY) *
        parseFloat(this.inputUnitPrice == '' ? 0 : this.inputUnitPrice)).toFixed(2);

      totalValue = parseFloat(qty_price_value);

      this.totalUnitPrice = totalValue;

      if (this.click == true) {
        if (parseInt(totalValue) != 0) {
          addTCSAmount = (((parseFloat(this.tcsPercent) * parseFloat(totalValue)) / 100)).toFixed(2);
        } else {
          addTCSAmount = 0;
        }
        this.tcsValue = parseFloat(addTCSAmount);
        totalValue = (parseFloat(this.tcsValue) + parseFloat(totalValue)).toFixed(2);
      } else {
        this.tcsValue = 0;
      }

      this.totalValue = parseFloat(totalValue).toFixed(2);

    }

  }

  // Advance Tab calculation based on GSTBaseValue with GST

  basedOnGSTBaseValue() {

    let qty_price_value: any = 0;

    qty_price_value = (parseFloat(this.selectQTY == null ? 0 : this.selectQTY) *
      parseFloat(this.inputUnitPrice == '' ? 0 : this.inputUnitPrice)).toFixed(2);

    if (this.gstBaseVal == parseFloat(qty_price_value)) {

      this.onCalculation();

    } else {

      let totalGST: any = 0;
      let sgst: any = 0;
      let cgst: any = 0;
      let igst: any = 0;
      let totalValue: any = 0;
      let addTCSAmount: any = 0;

      if (this.advanceGSTInput == 'gst') {

        if (this.advanceSGST != 0 && this.advanceSGST != null || this.advanceCGST != 0 && this.advanceCGST != null) {

          sgst = ((parseFloat(this.gstBaseVal) * parseFloat(this.advanceSGST)) / 100).toFixed(2);
          cgst = ((parseFloat(this.gstBaseVal) * parseFloat(this.advanceCGST)) / 100).toFixed(2);

          this.advanceSGSTWithGSTBaseValue = parseFloat(sgst).toFixed(2);
          this.advanceCGSTWithGSTBaseValue = parseFloat(cgst).toFixed(2);

          totalGST = (parseFloat(sgst) + parseFloat(cgst)).toFixed(2);
        }
      }


      if (this.advanceGSTInput == 'igst') {

        if (this.advanceIGST != 0 && this.advanceIGST != null) {

          igst = ((parseFloat(this.gstBaseVal) * parseFloat(this.advanceIGST)) / 100).toFixed(2);

          this.advanceIGSTWithGSTBaseValue = parseFloat(igst).toFixed(2);

          totalGST = (parseFloat(igst)).toFixed(2);
        }
      }

      this.gstVal = parseFloat(totalGST);
      totalValue = (parseFloat(qty_price_value) + parseFloat(this.gstVal)).toFixed(2);

      if (this.click == true) {
        if (parseInt(totalValue) != 0) {
          addTCSAmount = (((parseFloat(this.tcsPercent) * parseFloat(this.gstBaseVal)) / 100)).toFixed(2);
        } else {
          addTCSAmount = 0;
        }
        this.tcsValue = parseFloat(addTCSAmount);
        totalValue = (parseFloat(this.tcsValue) + parseFloat(totalValue)).toFixed(2);
      } else {
        this.tcsValue = 0;
      }

      this.totalValue = parseFloat(totalValue).toFixed(2);

    }

  }

  onSelectaddress(val) {
    this.selectAddress = val.target.value;
  }



  onSubmit_orderAck() {

    if (this.lineItemType == "M") {
      if (this.selection.selected.length != 0) {

        this.order_data = this.orderAckForm.value;

        this.dataSelected = [];
        let totalValue = 0;

        for (let val of this.selection.selected) {
          let value = val;
          totalValue += parseFloat(value['ItemValuewithGST']);
          this.dataSelected.push(val);
        }

        if (this.divisionValue == "" && this.categoryValue == "" && this.regionValue == "" &&
          this.pmValue == "") {

          this.toastr.error("Please fill the (*) required fields");

        } else {

          let materialDate = moment(this.materialDate).format('DD-MM-YYYY');

          if (materialDate == "Invalid date") {
            materialDate = "";
          }

          let TotalFreight: any = 0;

          if (this.freight != 0) {
            let a = this.calculate('freight_amt');
            a = a || 0
            TotalFreight = parseFloat(this.freight) + parseFloat(a);
          }


          this.order_data.ProformaID = this.proformaId;
          this.order_data.Advance = this.advance == '' ? 0 : this.advance;
          this.order_data.Retention = this.retention == '' ? 0 : this.retention;
          this.order_data.MaterialReadinessDate = materialDate == '' ? null : materialDate;
          this.order_data.Freight = this.freight == '' ? 0 : this.freight;
          this.order_data.DivisionId = this.divisionValue == "" ? 0 : this.divisionValue;
          this.order_data.CategoryId = this.categoryValue == "" ? 0 : this.categoryValue;
          this.order_data.RegionId = this.regionValue == "" ? 0 : this.regionValue;
          this.order_data.ProjectManagerId = this.pmValue == "" ? 0 : this.pmValue;
          this.order_data.JobCode = this.jobcodeValue == "" ? null : this.jobcodeValue;
          this.order_data.WBS = this.wbsValue == "" ? null : this.wbsValue;
          this.order_data.Party_Address = this.selectAddress == "" ? null : this.selectAddress;
          this.order_data.TCSApplicable = this.click == true ? "yes" : "no";
          this.order_data.TCS = this.click == true ? this.tcsPercent : 0;
          this.order_data.TCSAmount = this.click == true ? this.tcsValue : 0;
          this.order_data.TotalUnitPrice = this.totalUnitPrice == 0 ? null : this.totalUnitPrice;
          this.order_data.TotalAmount = this.totalValueWithoutAdvanceRetention == 0 ? null : this.totalValueWithoutAdvanceRetention;
          this.order_data.TotalAmountWithTCS = this.totalValue == 0 ? null : this.totalValue;

          this.order_data.GSTBaseValue = this.gstBaseVal == '' ? 0 : this.gstBaseVal;
          this.order_data.PI_DueDays = this.PI_DueDays == "" ? null : this.PI_DueDays;
          this.order_data.PI_DueDate = this.PI_DueDate == "" ? null : this.PI_DueDate;
          this.order_data.PI_Remarks = this.remarksValue == "" ? null : this.remarksValue;

          this.order_data.PI_TotalDiscount = this.calculate('dis_amt');
          this.order_data.PI_TotalPf = this.calculate('pf_amt');
          this.order_data.PI_TotalFreight = TotalFreight == 0 ? this.calculate('freight_amt') : TotalFreight;
          this.order_data.PI_TotalSGST = this.calculate('sgst_amt');
          this.order_data.PI_TotalCGST = this.calculate('cgst_amt');
          this.order_data.PI_TotalIGST = this.calculate('igst_amt');

          this.order_data.PI_NO = this.newPIcode;


          this.order_data.BankAcc = this.bankAcc;
          this.order_data.BankIFSC = this.bankIFSC;


          let url = "get_order_ack/"

          this.apiService.postData(url, this.order_data).then((result: any) => {

            if (result.value == true) {
              this.orderAck = result.data;
              this.onSubmit_orderAckHistory();
            }
          });
        }
      } else {

        this.toastr.error("Please select the line items");

      }
    } else {

      if (this.inputDescription != "" && this.inputUOM != "" && this.inputUnitPrice != "" &&
        this.percentOnAmt != "" && this.apbgDetails != "" && this.selectQTY != 0) {

        if (this.divisionValue == "" && this.categoryValue == "" && this.regionValue == "" &&
          this.pmValue == "") {

          this.toastr.error("Please fill the (*) required fields");

        } else {

          this.order_data = this.orderAckForm.value;

          this.order_data.ProformaID = this.proformaId;
          this.order_data.Advance = null;
          this.order_data.Retention = null;
          this.order_data.MaterialReadinessDate = null;
          this.order_data.Freight = null;
          this.order_data.DivisionId = this.divisionValue == "" ? 0 : this.divisionValue;
          this.order_data.CategoryId = this.categoryValue == "" ? 0 : this.categoryValue;
          this.order_data.RegionId = this.regionValue == "" ? 0 : this.regionValue;
          this.order_data.ProjectManagerId = this.pmValue == "" ? 0 : this.pmValue;
          this.order_data.JobCode = this.jobcodeValue == "" ? null : this.jobcodeValue;
          this.order_data.WBS = this.wbsValue == "" ? null : this.wbsValue;
          this.order_data.Party_Address = this.selectAddress == "" ? null : this.selectAddress;
          this.order_data.TCSApplicable = this.click == true ? "yes" : "no";
          this.order_data.TCS = this.click == true ? this.tcsPercent : 0;
          this.order_data.TCSAmount = this.click == true ? this.tcsValue : 0;
          this.order_data.TotalUnitPrice = this.inputUnitPrice;
          if (this.lineItemType == "R") {
            this.order_data.TotalAmount = this.totalUnitPrice == 0 ? null : this.totalUnitPrice;
          } else {
            this.order_data.TotalAmount = this.gstVal == 0 ? null : this.gstVal;
          }
          this.order_data.TotalAmountWithTCS = this.totalValue;

          this.order_data.GSTBaseValue = this.gstBaseVal == '' ? 0 : this.gstBaseVal;
          this.order_data.PI_DueDays = this.PI_DueDays == "" ? null : this.PI_DueDays;
          this.order_data.PI_DueDate = this.PI_DueDate == "" ? null : this.PI_DueDate;
          this.order_data.PI_Remarks = this.remarksValue == "" ? null : this.remarksValue;

          this.order_data.PI_TotalDiscount = null;
          this.order_data.PI_TotalPf = null
          this.order_data.PI_TotalFreight = null
          this.order_data.PI_TotalSGST = this.advanceSGSTWithGSTBaseValue == 0 ? null : this.advanceSGSTWithGSTBaseValue;
          this.order_data.PI_TotalCGST = this.advanceCGSTWithGSTBaseValue == 0 ? null : this.advanceCGSTWithGSTBaseValue;
          this.order_data.PI_TotalIGST = this.advanceIGSTWithGSTBaseValue == 0 ? null : this.advanceIGSTWithGSTBaseValue;

          this.order_data.PI_NO = this.newPIcode;

          let url = "get_order_ack/"

          this.apiService.postData(url, this.order_data).then((result: any) => {

            if (result.value == true) {
              this.orderAck = result.data;
              this.onSubmit_orderAckHistory();
            }
          });
        }
      } else {
        this.toastr.error("Please fill the line item");
      }
    }
  }

  onSubmit_orderAckHistory() {

    if (this.lineItemType == "M") {

      if (this.dataSelected != undefined && this.dataSelected.length != 0) {

        this.order_his_data = [];

        this.dataSelected.forEach((val, index) => {

          let materialDate = moment(this.orderAck.MaterialReadinessDate).format('DD-MM-YYYY');

          if (materialDate == "Invalid date") {
            materialDate = "";
          }

          this.order_his_data.push({
            'OrderAckId': this.orderAck.OrderAckId,
            'ProformaItemid': val.ProformaItemid,
            'ProformaID': this.orderAck.ProformaID,
            'Type': this.lineItemType,
            'Description': val.MaterialDesc,
            'PercentonAmt': null,
            'APBGDetails': null,
            'PartName': val.PartName,
            'HSN': val.HSN,
            'Qty': val.Qtymodels,
            'UOM': val.UOM,
            'UnitPrice': val.UnitPrice,
            'Advance': this.orderAck.Advance,
            'Retention': this.orderAck.Retention,
            'MaterialReadinessDate': materialDate == "" ? null : materialDate,
            'Freight': this.orderAck.Freight,
            'IGST': val.IGSTPercent,
            'SGST': val.SGSTpercent,
            'CGST': val.CGSTPercent,
            'PaymentTerms': null,
            'category_id': this.orderAck.CategoryId,
            'division_id': this.orderAck.DivisionId,
            'region_id': this.orderAck.RegionId,
            'TotalAmount': this.totalValueWithGST[val.indexPosition],
            'TotalAdvance': 0,
            'TotalRetention': 0,
            'GSTBaseValue': 0,

            'PI_Qty': this.piQTY[val.indexPosition],
            'PI_Discount': this.discountTotal[val.indexPosition],
            'PI_Pf': this.pfTotalAmount[val.indexPosition],
            'PI_Freight': this.freightTotalAmount[val.indexPosition],
            'PI_SGST': this.sgstTotalAmount[val.indexPosition],
            'PI_CGST': this.cgstTotalAmount[val.indexPosition],
            'PI_IGST': this.igstTotalAmount[val.indexPosition],
          });
        });
      }

    } else {

      this.order_his_data = [];

      this.order_his_data.push({
        'OrderAckId': this.orderAck.OrderAckId,
        'ProformaItemid': null,
        'ProformaID': this.orderAck.ProformaID,
        'Type': this.lineItemType,
        'Description': this.inputDescription == '' ? null : this.inputDescription,
        'PercentonAmt': this.percentOnAmt == '' ? null : this.percentOnAmt,
        'APBGDetails': this.apbgDetails == '' ? null : this.apbgDetails,
        'PartName': null,
        'HSN': null,
        'Qty': this.selectQTY,
        'UOM': this.inputUOM,
        'UnitPrice': this.inputUnitPrice,
        'Advance': null,
        'Retention': null,
        'MaterialReadinessDate': null,
        'Freight': null,
        'IGST': this.advanceIGST,
        'SGST': this.advanceSGST,
        'CGST': this.advanceCGST,
        'PaymentTerms': this.paymentTerms == '' ? null : this.paymentTerms,
        'category_id': this.orderAck.CategoryId,
        'division_id': this.orderAck.DivisionId,
        'region_id': this.orderAck.RegionId,
        'TotalAmount': this.totalValue,
        'TotalAdvance': 0,
        'TotalRetention': 0,
        'GSTBaseValue': this.gstBaseVal == 0 ? null : this.gstBaseVal,

        'PI_Qty': this.selectQTY,
        'PI_Discount': null,
        'PI_Pf': null,
        'PI_Freight': null,
        'PI_SGST': this.advanceSGSTWithGSTBaseValue,
        'PI_CGST': this.advanceCGSTWithGSTBaseValue,
        'PI_IGST': this.advanceIGSTWithGSTBaseValue,
      });
    }
    let url = "get_order_ack_history/"
    this.apiService.postData(url, this.order_his_data).then((result: any) => {

      if (result.value == true) {
        this.toastr.success("Created Successfully");
        this.get_OrderAcknowledgement_history();
      }
    });
  }


  getUserData() {
    let url = "user_list/"
    this.apiService.getData(url).then((result: any) => {
      this.userData = result.records;
    });
  }


  delete_OrderAcknowledgement_history(id, index) {

    const option: any = {
      title: "What's the purpose for delete this PI ?",
      text: "Remarks",
      input: 'textarea',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
    }

    swal.fire(option).then((res) => {

      if (res.isConfirmed == true) {

        if (res.value == undefined || res.value == "") {
          this.toastr.error("PI will not delete, If Remarks is not be filled !!!");
        } else {
          this.toastr.success("Deleted");

          let url = "get_order_ack/delete_item/";
          let data = { order_ack_id: id, remarks: res.value }
          this.apiService.postData(url, data).then((result: any) => {

            let data: any = result;
            data?.forEach((element, index) => {
              this.orderItems[0]?.forEach((val, ind) => {

                if (element.OrderAckId == id) {
                  this.piQTY[index] = parseFloat(this.piQTY[index]) + parseFloat(val.PI_Qty);
                  this.basedonPIQty(index);
                  if (this.piQTY[index] == 0) {
                    element['excluded'] = true;
                    this.orderRowDisable = true;
                  } else {
                    element['excluded'] = false;
                  }
                }
                if (this.orderItems[0]?.length == 0) {
                  this.orderRowDisable = false;
                }
              });
            });
          });
          this.windowReload();
        }
      }
    });
  }

  windowReload() {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }


  // List of order Acknowledgement API
  get_OrderAcknowledgement_history() {
    let Arr = [];
    this.orderAcknowledgementData = [];
    this.orderItems = [];
    let orderItems: any = [];

    let url = "get_order_ack/based_on_proforma_id/"
    let data = {
      proforma_id: this.proformaId
    }
    this.apiService.postData(url, data).then((result: any) => {

      let data: any = result.records;
      data?.forEach((element, index) => {

        if (element.ProformaID == this.proformaId) {
          Arr.push(element);
          this.dataSource1 = new MatTableDataSource(Arr);
          this.dataSource1.data = Arr;
          this.orderAcknowledgementData.push(element);
          let value = element.order;
          this.orderItems.push(value.sort((a, b) => b.OrderAck_HistoryId - a.OrderAck_HistoryId));
          orderItems.push({ value: element.order });
          this.userData?.forEach(val => {
            if (element.SubmittedBy == val.id) {
              this.submittedBy = val.EmployeeName;
            }
          });

          let data: any = this.dataItems;

          data.forEach((element, index) => {
            orderItems?.forEach((val, ind) => {
              let value = val.value;
              value?.forEach(ele => {
                if (element.ProformaItemid == ele.ProformaItemid) {
                  // this.dataItems[index].Qtymodels = parseFloat(this.dataItems[index].Qtymodels) - parseFloat(val.PI_Qty);
                  this.piQTY[index] = parseFloat(this.piQTY[index]) - parseFloat(ele.PI_Qty);
                  this.basedonPIQty(index);
                  if (this.piQTY[index] == 0) {
                    element['excluded'] = true;
                    this.orderRowDisable = true;
                  }
                }
              });
            });

            console.log(element);
          });
        }
      });
    });
    window.location.reload();
  }


  duplicate_getOrderAcknowledgement(bool) {
    let Arr = [];
    this.orderAcknowledgementData = [];
    this.orderItems = [];
    let orderItems: any = [];

    let url = "get_order_ack/based_on_proforma_id/"
    let data = {
      proforma_id: this.proformaId
    }
    this.apiService.postData(url, data).then((result: any) => {

      let data: any = result.records;
      data?.forEach((element, index) => {

        if (element.ProformaID == this.proformaId) {
          Arr.push(element);
          this.dataSource1 = new MatTableDataSource(Arr);
          this.dataSource1.data = Arr;
          this.orderAcknowledgementData.push(element);
          let value = element.order;
          this.orderItems.push(value.sort((a, b) => b.OrderAck_HistoryId - a.OrderAck_HistoryId));
          orderItems.push({ value: element.order });
          this.userData?.forEach(val => {
            if (element.SubmittedBy == val.id) {
              this.submittedBy = val.EmployeeName;
            }
          });

          let data: any = this.dataItems;
          orderItems?.forEach(val => {
            let value = val.value;
            value?.forEach((ele, ind) => {
              data.forEach((element, index) => {
                if (element.ProformaItemid == ele.ProformaItemid) {
                  // this.dataItems[index].Qtymodels = parseFloat(this.dataItems[index].Qtymodels) - parseFloat(val.PI_Qty);
                  if (element['excluded'] == false) {
                    this.piQTY[index] = parseFloat(this.piQTY[index]) - parseFloat(ele.PI_Qty);
                  }
                  this.basedonPIQty(index);
                  if (this.piQTY[index] == 0) {
                    element['excluded'] = true;
                    this.orderRowDisable = true;
                  }
                }
              });
            });
          });
        }
      });
    });
  }


  // Mat-Table footer calculations

  calculate(val) {

    let data: any;

    if (this.dataItems != undefined) {

      if (val == 'unit_price') {
        data = this.dataItems.map((element: any) => element.UnitPrice).reduce((total, value) => value == null ? null : parseFloat(total) + parseFloat(value), 0);
      }
      else if (val == 'total_price') {
        data = this.dataItems.map((element: any) => element.TotalPrice).reduce((total, value) => value == null ? null : parseFloat(total) + parseFloat(value), 0);
      }
      else if (val == 'dis_amt') {
        // data = this.dataItems.map((element: any) => this.discountTotal).reduce((total, value) => value == null ? null : parseFloat(total) + parseFloat(value), 0);
        this.discounttotalamt = 0;
        for (let i of this.discountTotal) {
          let val = i == null ? 0 : i;
          let float = parseFloat(val);
          this.discounttotalamt = this.discounttotalamt + float;
        }
        data = this.discounttotalamt;
      }
      else if (val == 'pf_amt') {

        this.pftotalamount = 0;
        for (let i of this.pfTotalAmount) {
          if (typeof i === 'string') {
            let val: any = i == null ? 0 : i;
            let float = parseFloat(val);
            this.pftotalamount = this.pftotalamount + float;
          } else {
            let val: any = i == null ? 0 : i;
            let float = parseFloat(val);
            this.pftotalamount = this.pftotalamount + float;
          }
        }
        data = this.pftotalamount;
      }
      else if (val == 'freight_amt') {

        this.freighttotalAmount = 0;

        for (let i of this.freightTotalAmount) {
          if (typeof i === 'string') {
            let val: any = i == null ? 0 : i;
            let float = parseFloat(val);
            this.freighttotalAmount = this.freighttotalAmount + float;
          } else {
            let val: any = i == null ? 0 : i;
            let float = parseFloat(val);
            this.freighttotalAmount = this.freighttotalAmount + float;
          }
        }

        data = this.freighttotalAmount;
        // data = this.dataItems.map((element: any) => this.freightTotalAmount).reduce((total, value) => value == null ? null : parseFloat(total) + parseFloat(value), 0);
      }
      else if (val == 'sgst_amt') {
        // data = this.dataItems.map((element: any) => this.sgstTotalAmount).reduce((total, value) => value == null ? null : parseFloat(total) + parseFloat(value), 0);
        this.sgsttotalamt = 0;
        for (let i of this.sgstTotalAmount) {
          let val = i == null ? 0 : i;
          let float = parseFloat(val);
          this.sgsttotalamt = this.sgsttotalamt + float;
        }
        data = this.sgsttotalamt;
      }
      else if (val == 'cgst_amt') {
        // data = this.dataItems.map((element: any) => this.cgstTotalAmount).reduce((total, value) => value == null ? null : parseFloat(total) + parseFloat(value), 0);
        this.cgsttotalamt = 0;
        for (let i of this.cgstTotalAmount) {
          let val = i == null ? 0 : i;
          let float = parseFloat(val);
          this.cgsttotalamt = this.cgsttotalamt + float;
        }
        data = this.cgsttotalamt;
      }
      else if (val == 'igst_amt') {
        // data = this.dataItems.map((element: any) => this.igstTotalAmount).reduce((total, value) => value == null ? null : parseFloat(total) + parseFloat(value), 0);
        this.igsttotalamt = 0;
        for (let i of this.igstTotalAmount) {
          let val = i == null ? 0 : i;
          let float = parseFloat(val);
          this.igsttotalamt = this.igsttotalamt + float;
        }
        data = this.igsttotalamt;
      }
      else if (val == 'total_amt') {
        data = this.dataItems.map((element: any) => this.totalValueWithGST).reduce((total, value) => value == null ? null : parseFloat(total) + parseFloat(value), 0);
      }
      return data
    }
  }


  generatePDF(element, index, type) {
    if (type == "print_with_logo") {

      let url = "get_order_ack/print_with_logo/" + this.orderAcknowledgementData[index].OrderAckId;
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

    else if (type == "print_without_logo") {

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

    else if (type == "print_aoitem") {

      let url = "get_order_ack/print_aoitem/" + this.orderAcknowledgementData[index].OrderAckId;
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

    else if (type == "print_sbi_bank") {
      let url = "get_order_ack/print_sbi_bank/" + this.orderAcknowledgementData[index].OrderAckId;
      this.apiService.downloadPDF(url).then((data) => {
        var downloadURL = window.URL.createObjectURL(data);
        let tab = window.open();
        tab.location.href = downloadURL;
      });
    }

  }


  updateFunc(element) {
    if (element.id != undefined) {
      let url = "get_order_ack/" + element.id.id + "/";
      this.apiService.putData(url, element.data).then((data) => {
        this.toastr.success("Updated Successfully");
      });
    }
  }


  updateOrderAck(element, el: HTMLElement) {

    this.orderAckID = element.OrderAckId;

    this.btnType = 'edit';

    this.divisionValue = element.DivisionId;
    this.categoryValue = element.CategoryId;
    this.regionValue = element.RegionId;
    this.pmValue = element.ProjectManagerId;

    this.wbsValue = element.WBS;
    this.remarksValue = element.PI_Remarks;

    this.jobcodeValue = element.JobCode;
    this.dueDaysValue = element.PI_DueDays;
    this.partyAddress = element.Party_Address;

    this.pi_code = element.PI_CODE;

    el.scrollIntoView({ behavior: 'smooth' });

    if (element.order[0].Type == "M") {

      this.flagType = 0;
      this.onSelectchange('material');

      this.advance = element.Advance == null ? 0 : element.Advance;
      this.retention = element.Retention == null ? 0 : element.Retention;
      this.materialDate = element.MaterialReadinessDate;

      this.freight = element.Freight == null ? 0 : element.Freight;

      if (element.TCSApplicable == "yes") {
        this.click = true;
        this.tcsPercent = element.TCS;
        this.tcsValue = element.TCSAmount;
      }

      this.totalValueWithoutAdvanceRetention = element.TotalAmount;

      this.totalValue = element.TotalAmountWithTCS;


      this.update_fetch_OrderAcknowledgement_history(element.OrderAckId);
    }
    else if (element.order[0].Type == "A") {

      this.flagType = 1;
      this.onSelectchange('advance');

      this.inputDescription = element.order[0].Description;
      this.selectQTY = element.order[0].Qty;
      this.inputUOM = element.order[0].UOM;
      this.inputUnitPrice = element.order[0].UnitPrice;
      this.percentOnAmt = element.order[0].PercentonAmt;
      this.apbgDetails = element.order[0].APBGDetails;

      this.paymentTerms = element.order[0].PaymentTerms;
      this.gstBaseVal = element.order[0].GSTBaseValue;

      if (element.TCSApplicable == "yes") {
        this.click = true;
        this.tcsPercent = element.TCS;
        this.tcsValue = element.TCSAmount;
      }

      if (element.order[0].PI_CGST == 0 && element.order[0].PI_SGST == 0) {

        this.seletedGST = 'igst';
        this.advanceGSTInput = 'igst';
        this.advanceIGST = element.order[0].PI_IGST;

      } else if (element.order[0].PI_IGST == 0) {

        this.seletedGST = 'gst';
        this.advanceGSTInput = 'gst';
        this.advanceSGST = element.order[0].PI_SGST;
        this.advanceCGST = element.order[0].PI_CGST;
      }

      this.basedonPIQty(0);

    }
    else if (element.order[0].Type == "R") {

      this.flagType = 2;
      this.onSelectchange('retention');

      this.inputDescription = element.order[0].Description;
      this.selectQTY = element.order[0].Qty;
      this.inputUOM = element.order[0].UOM;
      this.inputUnitPrice = element.order[0].UnitPrice;
      this.percentOnAmt = element.order[0].PercentonAmt;
      this.apbgDetails = element.order[0].APBGDetails;

      this.paymentTerms = element.order[0].PaymentTerms;

      if (element.TCSApplicable == "yes") {
        this.click = true;
        this.tcsPercent = element.TCS;
        this.tcsValue = element.TCSAmount;
      }

      this.basedonPIQty(0);

    }
  }


  onupdate_orderAck() {

    if (this.lineItemType == "M") {
      if (this.selection.selected.length != 0) {

        this.order_data = this.orderAckForm.value;

        this.dataSelected = [];
        let totalValue = 0;

        for (let val of this.selection.selected) {
          let value = val;
          totalValue += parseFloat(value['ItemValuewithGST']);
          this.dataSelected.push(val);
        }

        if (this.divisionValue == "" && this.categoryValue == "" && this.regionValue == "" &&
          this.pmValue == "") {

          this.toastr.error("Please fill the (*) required fields");

        } else {

          let materialDate = moment(this.materialDate).format('DD-MM-YYYY');

          if (materialDate == "Invalid date") {
            materialDate = "";
          }

          let TotalFreight: any = 0;

          if (this.freight != 0) {
            let a = this.calculate('freight_amt');
            a = a || 0
            TotalFreight = parseFloat(this.freight) + parseFloat(a);
          }

          this.order_data.ProformaID = this.proformaId;
          this.order_data.Advance = this.advance == '' ? 0 : this.advance;
          this.order_data.Retention = this.retention == '' ? 0 : this.retention;
          this.order_data.MaterialReadinessDate = materialDate == '' ? null : materialDate;
          this.order_data.Freight = this.freight == '' ? 0 : this.freight;
          this.order_data.DivisionId = this.divisionValue == "" ? 0 : this.divisionValue;
          this.order_data.CategoryId = this.categoryValue == "" ? 0 : this.categoryValue;
          this.order_data.RegionId = this.regionValue == "" ? 0 : this.regionValue;
          this.order_data.ProjectManagerId = this.pmValue == "" ? 0 : this.pmValue;
          this.order_data.JobCode = this.jobcodeValue == "" ? null : this.jobcodeValue;
          this.order_data.WBS = this.wbsValue == "" ? null : this.wbsValue;
          this.order_data.Party_Address = this.selectAddress == "" ? null : this.selectAddress;
          this.order_data.TCSApplicable = this.click == true ? "yes" : "no";
          this.order_data.TCS = this.click == true ? this.tcsPercent : 0;
          this.order_data.TCSAmount = this.click == true ? this.tcsValue : 0;
          this.order_data.TotalUnitPrice = this.totalUnitPrice == 0 ? null : this.totalUnitPrice;
          this.order_data.TotalAmount = this.totalValueWithoutAdvanceRetention == 0 ? null : this.totalValueWithoutAdvanceRetention;
          this.order_data.TotalAmountWithTCS = this.totalValue == 0 ? null : this.totalValue;

          this.order_data.GSTBaseValue = this.gstBaseVal == '' ? 0 : this.gstBaseVal;
          this.order_data.PI_DueDays = this.PI_DueDays == "" ? null : this.PI_DueDays;
          this.order_data.PI_DueDate = this.PI_DueDate == "" ? null : this.PI_DueDate;
          this.order_data.PI_Remarks = this.remarksValue == "" ? null : this.remarksValue;

          this.order_data.PI_TotalDiscount = this.calculate('dis_amt');
          this.order_data.PI_TotalPf = this.calculate('pf_amt');
          this.order_data.PI_TotalFreight = TotalFreight == 0 ? this.calculate('freight_amt') : TotalFreight;
          this.order_data.PI_TotalSGST = this.calculate('sgst_amt');
          this.order_data.PI_TotalCGST = this.calculate('cgst_amt');
          this.order_data.PI_TotalIGST = this.calculate('igst_amt');

          this.order_data.BankAcc = this.bankAcc;
          this.order_data.BankIFSC = this.bankIFSC;

          this.order_data.PI_CODE = this.pi_code;


          let url = "get_order_ack/" + this.orderAckID + "/";

          this.apiService.putData(url, this.order_data).then((result: any) => {

            if (result.value == true) {
              this.orderAck = result.data;
              this.onupdate_orderAckHistory();
            }
          });
        }
      } else {

        this.toastr.error("Please select the line items");

      }
    } else {

      if (this.inputDescription != "" && this.inputUOM != "" && this.inputUnitPrice != "" &&
        this.percentOnAmt != "" && this.apbgDetails != "" && this.selectQTY != 0) {

        if (this.divisionValue == "" && this.categoryValue == "" && this.regionValue == "" &&
          this.pmValue == "") {

          this.toastr.error("Please fill the (*) required fields");

        } else {

          this.order_data = this.orderAckForm.value;

          this.order_data.ProformaID = this.proformaId;
          this.order_data.Advance = null;
          this.order_data.Retention = null;
          this.order_data.MaterialReadinessDate = null;
          this.order_data.Freight = null;
          this.order_data.DivisionId = this.divisionValue == "" ? 0 : this.divisionValue;
          this.order_data.CategoryId = this.categoryValue == "" ? 0 : this.categoryValue;
          this.order_data.RegionId = this.regionValue == "" ? 0 : this.regionValue;
          this.order_data.ProjectManagerId = this.pmValue == "" ? 0 : this.pmValue;
          this.order_data.JobCode = this.jobcodeValue == "" ? null : this.jobcodeValue;
          this.order_data.WBS = this.wbsValue == "" ? null : this.wbsValue;
          this.order_data.Party_Address = this.selectAddress == "" ? null : this.selectAddress;
          this.order_data.TCSApplicable = this.click == true ? "yes" : "no";
          this.order_data.TCS = this.click == true ? this.tcsPercent : 0;
          this.order_data.TCSAmount = this.click == true ? this.tcsValue : 0;
          this.order_data.TotalUnitPrice = this.inputUnitPrice;
          if (this.lineItemType == "R") {
            this.order_data.TotalAmount = this.totalUnitPrice == 0 ? null : this.totalUnitPrice;
          } else {
            this.order_data.TotalAmount = this.gstVal == 0 ? null : this.gstVal;
          }
          this.order_data.TotalAmountWithTCS = this.totalValue;

          this.order_data.GSTBaseValue = this.gstBaseVal == '' ? 0 : this.gstBaseVal;
          this.order_data.PI_DueDays = this.PI_DueDays == "" ? null : this.PI_DueDays;
          this.order_data.PI_DueDate = this.PI_DueDate == "" ? null : this.PI_DueDate;
          this.order_data.PI_Remarks = this.remarksValue == "" ? null : this.remarksValue;

          this.order_data.PI_TotalDiscount = null;
          this.order_data.PI_TotalPf = null
          this.order_data.PI_TotalFreight = null
          this.order_data.PI_TotalSGST = this.advanceSGSTWithGSTBaseValue == 0 ? null : this.advanceSGSTWithGSTBaseValue;
          this.order_data.PI_TotalCGST = this.advanceCGSTWithGSTBaseValue == 0 ? null : this.advanceCGSTWithGSTBaseValue;
          this.order_data.PI_TotalIGST = this.advanceIGSTWithGSTBaseValue == 0 ? null : this.advanceIGSTWithGSTBaseValue;

          this.order_data.PI_CODE = this.pi_code;

          let url = "get_order_ack/" + this.orderAckID + "/";

          this.apiService.putData(url, this.order_data).then((result: any) => {

            if (result.value == true) {
              this.orderAck = result.data;
              this.onupdate_orderAckHistory();
            }
          });
        }
      } else {
        this.toastr.error("Please fill the line item");
      }
    }
  }


  onupdate_orderAckHistory() {

    if (this.lineItemType == "M") {

      if (this.dataSelected != undefined && this.dataSelected.length != 0) {

        this.order_his_data = [];

        this.orderAck.order.forEach((val, index) => {

          this.dataItems.forEach(element => {

            if (val.ProformaItemid == element.ProformaItemid) {

              let materialDate = moment(this.orderAck.MaterialReadinessDate).format('DD-MM-YYYY');

              if (materialDate == "Invalid date") {
                materialDate = "";
              }

              this.order_his_data.push({
                'OrderAckId': this.orderAck.OrderAckId,
                'OrderAck_HistoryId': val.OrderAck_HistoryId,
                'ProformaItemid': val.ProformaItemid,
                'ProformaID': this.orderAck.ProformaID,
                'Type': this.lineItemType == undefined ? null : this.lineItemType,
                'Description': val.Description == undefined ? null : val.Description,
                'PercentonAmt': null,
                'APBGDetails': null,
                'PartName': val.PartName == undefined ? null : val.PartName,
                'HSN': val.HSN == undefined ? null : val.HSN,
                'Qty': val.Qty == undefined ? null : val.Qty,
                'UOM': val.UOM == undefined ? null : val.UOM,
                'UnitPrice': val.UnitPrice == undefined ? null : val.UnitPrice,
                'Advance': this.orderAck.Advance == undefined ? null : this.orderAck.Advance,
                'Retention': this.orderAck.Retention == undefined ? null : this.orderAck.Retention,
                'MaterialReadinessDate': materialDate == "" ? null : materialDate,
                'Freight': this.orderAck.Freight == undefined ? null : this.orderAck.Freight,
                'IGST': val.IGST == undefined ? null : val.IGST,
                'SGST': val.SGST == undefined ? null : val.SGST,
                'CGST': val.CGST == undefined ? null : val.CGST,
                'PaymentTerms': null,
                'category_id': this.orderAck.CategoryId == undefined ? null : this.orderAck.CategoryId,
                'division_id': this.orderAck.DivisionId == undefined ? null : this.orderAck.DivisionId,
                'region_id': this.orderAck.RegionId == undefined ? null : this.orderAck.RegionId,
                'TotalAmount': this.totalValueWithGST[element.indexPosition] == undefined ? null : this.totalValueWithGST[element.indexPosition],
                'TotalAdvance': 0,
                'TotalRetention': 0,
                'GSTBaseValue': 0,

                'PI_Qty': this.piQTY[element.indexPosition] == undefined ? null : this.piQTY[element.indexPosition],
                'PI_Discount': this.discountTotal[element.indexPosition] == undefined ? null : this.discountTotal[element.indexPosition],
                'PI_Pf': this.pfTotalAmount[element.indexPosition] == undefined ? null : this.pfTotalAmount[element.indexPosition],
                'PI_Freight': this.freightTotalAmount[element.indexPosition] == undefined ? null : this.freightTotalAmount[element.indexPosition],
                'PI_SGST': this.sgstTotalAmount[element.indexPosition] == undefined ? null : this.sgstTotalAmount[element.indexPosition],
                'PI_CGST': this.cgstTotalAmount[element.indexPosition] == undefined ? null : this.cgstTotalAmount[element.indexPosition],
                'PI_IGST': this.igstTotalAmount[element.indexPosition] == undefined ? null : this.igstTotalAmount[element.indexPosition],
              });
            }
          });
        });
      }
    } else {

      this.order_his_data = [];

      this.order_his_data.push({
        'OrderAckId': this.orderAck.OrderAckId,
        'OrderAck_HistoryId': this.orderAck.order[0].OrderAck_HistoryId,
        'ProformaItemid': null,
        'ProformaID': this.orderAck.ProformaID,
        'Type': this.lineItemType == undefined ? null : this.lineItemType,
        'Description': this.inputDescription == '' ? null : this.inputDescription,
        'PercentonAmt': this.percentOnAmt == '' ? null : this.percentOnAmt,
        'APBGDetails': this.apbgDetails == '' ? null : this.apbgDetails,
        'PartName': null,
        'HSN': null,
        'Qty': this.selectQTY == undefined ? null : this.selectQTY,
        'UOM': this.inputUOM == undefined ? null : this.inputUOM,
        'UnitPrice': this.inputUnitPrice == undefined ? null : this.inputUnitPrice,
        'Advance': null,
        'Retention': null,
        'MaterialReadinessDate': null,
        'Freight': null,
        'IGST': this.advanceIGST == undefined ? null : this.advanceIGST,
        'SGST': this.advanceSGST == undefined ? null : this.advanceSGST,
        'CGST': this.advanceCGST == undefined ? null : this.advanceCGST,
        'PaymentTerms': this.paymentTerms == '' ? null : this.paymentTerms,
        'category_id': this.orderAck.CategoryId == undefined ? null : this.orderAck.CategoryId,
        'division_id': this.orderAck.DivisionId == undefined ? null : this.orderAck.DivisionId,
        'region_id': this.orderAck.RegionId == undefined ? null : this.orderAck.RegionId,
        'TotalAmount': this.totalValue == undefined ? null : this.totalValue,
        'TotalAdvance': 0,
        'TotalRetention': 0,
        'GSTBaseValue': this.gstBaseVal == 0 ? null : this.gstBaseVal,

        'PI_Qty': this.selectQTY == undefined ? null : this.selectQTY,
        'PI_Discount': null,
        'PI_Pf': null,
        'PI_Freight': null,
        'PI_SGST': this.advanceSGSTWithGSTBaseValue == undefined ? null : this.advanceSGSTWithGSTBaseValue,
        'PI_CGST': this.advanceCGSTWithGSTBaseValue == undefined ? null : this.advanceCGSTWithGSTBaseValue,
        'PI_IGST': this.advanceIGSTWithGSTBaseValue == undefined ? null : this.advanceIGSTWithGSTBaseValue,
      });
    }

    let url = "get_order_ack_history/update_orderAckHistory/"
    this.apiService.postData(url, this.order_his_data).then((result: any) => {

      if (result.status == true) {
        this.toastr.success("Updated");
        this.btnType = "";
        this.get_OrderAcknowledgement_history();
      }
    });
  }


  calculationBasedonItems(index, val) {

    let totalQty_value: any = 0;

    let discountAmt: any = 0;
    let pfPercentAmt: any = 0;
    let freightAmt: any = 0;
    let cgstAmt: any = 0;
    let sgstAmt: any = 0;
    let igstAmt: any = 0;

    if (val == 'unitprice') {

      if (this.dataItems[index].Qtymodels < this.piQTY[index]) {

        this.toastr.error("Qty value is larger than actual Qty value");

        this.piQTY[index] = this.dataItems[index].Qtymodels;

        totalQty_value = this.dataItems[index].ItemValuewithGST;
        this.igstTotalAmount[index] = this.dataItems[index].IGSTAmount;
        this.sgstTotalAmount[index] = this.dataItems[index].SGSTAmount;
        this.cgstTotalAmount[index] = this.dataItems[index].CGSTAmount;
        this.freightTotalAmount[index] = this.dataItems[index].FreightAmount;
        this.pfTotalAmount[index] = this.dataItems[index].PFAmount;
        this.discountTotal[index] = this.dataItems[index].DiscountAmount;

      } else {

        totalQty_value = (parseFloat(this.piQTY[index]) * parseFloat(this.dataItems[index].UnitPrice)).toFixed(2);
        // this.piQTYTotal[index] = totalQty_value;

        if (this.piQTY[index] == null) {
          totalQty_value = (parseFloat(this.dataItems[index].Qtymodels) * parseFloat(this.dataItems[index].UnitPrice)).toFixed(2);
          this.piQTYTotal[index] = totalQty_value;
        }

        this.totalValueWithGST[index] = totalQty_value;

        this.totalAmount = 0;
        for (let i of this.totalValueWithGST) {
          let val = i
          let float = parseFloat(val);
          if (float !== float) {
            float = 0;
          }
          this.totalAmount = this.totalAmount + float;
        }

        this.basedonItemno = true;
        this.itemIndex = index;

        this.basedonPIQty(index);
      }

    }
  }


  update_fetch_OrderAcknowledgement_history(id) {

    let Arr = [];
    this.orderAcknowledgementData = [];
    this.orderItems = [];
    let orderItems: any = [];

    let url = "get_order_ack/based_on_proforma_id/"
    let data = {
      proforma_id: this.proformaId
    }
    this.apiService.postData(url, data).then((result: any) => {

      let data: any = result.records;
      data?.forEach((element, index) => {

        if (element.ProformaID == this.proformaId) {
          Arr.push(element);
          this.dataSource1 = new MatTableDataSource(Arr);
          this.dataSource1.data = Arr;
          this.orderAcknowledgementData.push(element);
          let value = element.order;
          this.orderItems.push(value.sort((a, b) => b.OrderAck_HistoryId - a.OrderAck_HistoryId));
          orderItems.push({ value: element.order });
          this.userData?.forEach(val => {
            if (element.SubmittedBy == val.id) {
              this.submittedBy = val.EmployeeName;
            }
          });

          let data: any = this.dataItems;
          orderItems?.forEach(val => {
            let value = val.value;
            value?.forEach((ele, ind) => {
              data.forEach((element, index) => {
                if (element.ProformaItemid == ele.ProformaItemid) {
                  this.piQTY[index] = parseFloat(this.piQTY[index]) + parseFloat(ele.PI_Qty);
                  if (this.piQTY[index] == 0) {
                    element['excluded'] = true;
                    this.orderRowDisable = true;
                  } else {
                    element['excluded'] = false;
                    this.orderRowDisable = false;
                    this.selection.toggle(element);
                    element['check'] = true;
                  }


                  if (this.dataItems[index].ItemNo != null && this.dataItems[index].ItemValuewithGST != null) {

                    this.calculationBasedonItems(index, 'unitprice');

                  }

                }
              });
            });
          });
        }
      });
    });
  }


  openDialog(element) {

    let data;
    let tcspercent = 0;
    let tcsvalue = 0;

    if (element.TCSApplicable == "yes") {
      tcspercent = element.TCS;
      tcsvalue = element.TCSAmount;
    }

    if (element.order[0].Type == "M") {
      data = {
        advance: element.Advance, retention: element.Retention, freight: element.Freight,
        mat_ready_date: element.MaterialReadinessDate, total_igst: element.PI_TotalIGST,
        total_cgst: element.PI_TotalCGST, total_sgst: element.PI_TotalSGST,
        total_amt: element.TotalAmount, total_amt_with_tcs: element.TotalAmountWithTCS,
        tcsper: tcspercent, tcsval: tcsvalue
      }
    }

    else if (element.order[0].Type == "A") {
      data = {
        description: element.order[0].Description, on_amt: element.order[0].PercentonAmt,
        abg_details: element.order[0].APBGDetails, qty: element.order[0].PI_Qty, uom: element.order[0].UOM,
        unit_rate: element.order[0].UnitPrice, igst_p: element.order[0].IGST, cgst_p: element.order[0].CGST,
        sgst_p: element.order[0].SGST, igst_amt: element.order[0].PI_IGST, cgst_amt: element.order[0].PI_CGST,
        sgst_amt: element.order[0].PI_SGST, gst_base_value: element.order[0].GSTBaseValue,
        total_amt: element.order[0].TotalAmount, payment_terms: element.order[0].PaymentTerms,
        tcsper: tcspercent, tcsval: tcsvalue
      }
    }

    else if (element.order[0].Type == "R") {
      data = {
        description: element.order[0].Description, on_amt: element.order[0].PercentonAmt,
        abg_details: element.order[0].APBGDetails, qty: element.order[0].PI_Qty, uom: element.order[0].UOM,
        unit_rate: element.order[0].UnitPrice, total_amt: element.order[0].TotalAmount, payment_terms: element.order[0].PaymentTerms,
        tcsper: tcspercent, tcsval: tcsvalue
      }
    }

    const dialogRef = this.dialog.open(EditDialog, {
      height: '700px',
      width: '1200px',
      data: {
        id: element.OrderAckId, division: element.DivisionId,
        category: element.CategoryId, region: element.RegionId,
        pm: element.ProjectManagerId, jobcode: element.JobCode,
        wbs: element.WBS, partyadd: element.Party_Address,
        remarks: element.PI_Remarks, pi_duedate: element.PI_DueDate, pi_duedays: element.PI_DueDays,
        type: element.order[0].Type, obj_data: data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updateFunc(result);
    });
  }

}


@Component({
  selector: 'edit-dialog',
  templateUrl: 'edit-dialog.html'
  , styles: [`
    :host {
      display:flex;
      flex-direction: column;
      height: 100%;
    }

    mat-dialog-content {
      flex-grow: 1;
    }

  .label-bg label{
      padding: 3px;
      width: 200px;
      margin-top: 5px;
  }
  
  .label-bg select{
      width: 60%;
      height: 23px;
  }
  
  .label-bg input{
      width: 60%;
      height: 23px;
  }
  
  .label-bg textarea{
      width: 75%;
      height: 55px;
  }
  `]
})
export class EditDialog {

  divisionList: any;
  divisionId: any;
  divisionValue: any;

  categoryList: any;
  categoryId: any;
  categoryValue: any;

  regionList: any;
  regionId: any;
  regionValue: any;

  projectManagerList: any;
  PMId: any;
  pmValue: any;

  jobcodeValue: any;
  dueDaysValue: any;
  wbsValue: any;
  remarksValue: any;

  PI_DueDate: any;
  PI_DueDays: any;
  duedays: any = [];

  selectAddress: any;
  select_address: any;

  partyAddress: any;

  type: any;

  m_advance: any;
  m_retention: any;
  m_mat_ready_date: any;
  m_freight: any;
  m_totaligst: any;
  m_totalcgst: any;
  m_totalsgst: any;
  m_totalamt: any;
  m_totalamtwithtcs: any;

  tcspercent: any;
  tcsvalue: any;

  constructor(
    public apiService: ApiService,
    public dialogRef: MatDialogRef<ProformaViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.divisionListFunc();
    this.categoryListFunc();
    this.regionListFunc();
    this.projectManagerListFunc();
    this.onload();
  }

  divisionListFunc() {
    let url = 'division_master_list/'
    this.apiService.getData(url).then((result: any) => {
      this.divisionList = result.records;
      this.divisionId = this.data.division;
      this.divisionList.forEach(element => {
        if (this.divisionId == element.DivisionId) {
          this.divisionValue = element.DivisionId;
          element['isSelected'] = true;
        } else {
          element['isSelected'] = false;
        }
      });
    });
  }

  categoryListFunc() {
    let url = 'category_master_list/'
    this.apiService.getData(url).then((result: any) => {
      this.categoryList = result.records;
      this.categoryId = this.data.category;
      this.categoryList.forEach(element => {
        if (this.categoryId == element.CategoryId) {
          this.categoryValue = element.CategoryId;
          element['isSelected'] = true;
        } else {
          element['isSelected'] = false;
        }
      });
    });
  }

  regionListFunc() {
    let url = 'region_master_list/'
    this.apiService.getData(url).then((result: any) => {
      this.regionList = result.records;
      this.regionId = this.data.region;
      this.regionList.forEach(element => {
        if (this.regionId == element.RegionId) {
          this.regionValue = element.RegionId;
          element['isSelected'] = true;
        } else {
          element['isSelected'] = false;
        }
      });
    });
  }

  projectManagerListFunc() {
    let url = 'projectmanager_master_list/'
    this.apiService.getData(url).then((result: any) => {
      this.projectManagerList = result.records;
      this.PMId = this.data.pm;
      this.projectManagerList.forEach(element => {
        if (this.PMId == element.PMId) {
          this.pmValue = element.PMId;
          element['isSelected'] = true;
        } else {
          element['isSelected'] = false;
        }
      });
    });
  }

  onload() {

    console.log(this.data);

    for (let i = 0; i <= 180; i++) {
      this.duedays.push(i)
    }

    this.jobcodeValue = this.data.jobcode;
    this.wbsValue = this.data.wbs;
    this.remarksValue = this.data.remarks;
    this.partyAddress = this.data.partyadd;
    this.dueDaysValue = this.data.pi_duedays;
    let duedate = moment(this.data.pi_duedate).format("DD-MM-YYYY")
    this.PI_DueDate = duedate;
    this.PI_DueDays = this.data.pi_duedays;

    if (this.data.type == "M") {

      let material = this.data.obj_data;

      this.m_advance = material.advance;
      this.m_retention = material.retention;
      this.m_mat_ready_date = material.mat_ready_date;
      this.m_freight = material.freight;

      this.m_totaligst = material.total_igst;
      this.m_totalcgst = material.total_cgst;
      this.m_totalsgst = material.total_igst;

      this.m_totalamt = material.total_amt;
      this.m_totalamtwithtcs = material.total_amt_with_tcs;

      this.tcspercent = material.tcsper;
      this.tcsvalue = material.tcsval;

    }
    else if (this.data.type == "A") {

    }
    else if (this.data.type == "R") {

    }
  }

  PIDueDays(val) {

    const d = moment();
    var PIDueDate: any = moment(d).add(val.target.value, 'days').format('DD-MM-YYYY');

    this.PI_DueDate = PIDueDate;
    this.PI_DueDays = val.target.value;
  }

  onSelectaddress(val) {
    this.selectAddress = val.target.value;
  }

  onSubmit() {

    this.divisionValue = this.divisionValue ? this.divisionValue : 0;
    this.categoryValue = this.categoryValue ? this.categoryValue : 0;
    this.regionValue = this.regionValue ? this.regionValue : 0;
    this.pmValue = this.pmValue ? this.pmValue : 0;

    let data = {
      DivisionId: this.divisionValue,
      CategoryId: this.categoryValue,
      RegionId: this.regionValue,
      ProjectManagerId: this.pmValue,
      JobCode: this.jobcodeValue,
      WBS: this.wbsValue,
      PI_DueDays: this.PI_DueDays,
      PI_DueDate: this.PI_DueDate,
      PI_Remarks: this.remarksValue,
      Party_Address: this.partyAddress
    }

    let ord_id = {
      id: this.data.id
    }

    this.dialogRef.close({ data: data, id: ord_id });
  }


  materialWise(type) {

    if (type == "advance") {

    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
