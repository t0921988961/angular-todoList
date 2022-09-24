import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from 'src/service/local-storage.service';
import { FormBuilder, Validators } from '@angular/forms';


import { nanoid as randomId } from 'nanoid'; // nonoid
import * as moment from 'moment';

import { of } from 'rxjs';
import { tap, map, switchMap, finalize } from 'rxjs/operators';

/*-- PrimeNg --*/
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { LayoutService } from './service/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService], // 問題回報 primeng Dialoag,
})


export class AppComponent implements OnInit {

  initTodo: any = [
    {
      tId: 'NcMjBXBIDWlrNVCIjaA14',
      content: 'Perspiciatis sunt non aut culpa omnis saepe.',
      time: '2020-09-17 20:48:20',
      done: false
    },
    {
      tId: 'cBzgv-S8SJwbBjqijX6xv',
      content: 'Eaque eum blanditiis nisi.',
      time: '2021-09-18 21:48:30',
      done: true
    },
    {
      tId: 'JXlsjKX8c81poDoPenXDL',
      content: 'Dolorum sint natus aut dolores rerum voluptate hic.',
      time: '2022-09-19 22:48:40',
      done: false
    },
    {
      tId: 'Pl-Zbw31MNBC1KgCOVcMO',
      content: 'Numquam in laboriosam corporis eveniet dolor odio.',
      time: '2022-09-20 23:48:50',
      done: false
    }
  ];

  filter = 'all'; // all, active, done
  inputContent = '';

  displayEdit = false; // dialog edit todo
  selectedRows: any; // selected todo
  loading = false; // table is loading
  /** Todo列表 */
  shareList: any = [];
  /** Todo列表 table欄位 */
  colShareList = [
    { field: 'select', header: '完成' },
    { field: 'tId', header: 'ID' },
    { field: 'content', header: '內容' },
    { field: 'time', header: '時間' },
    { field: 'function', header: '功能' },
  ];

  editTodo: any;
  editForm = this.formBuilder.group({
    content: ['', Validators.required], // todo content
  })

  constructor(
    private primengConfig: PrimeNGConfig,
    public localStorage: LocalStorageService,
    private formBuilder: FormBuilder,
    // primeng
    private confirmationService: ConfirmationService,
    public messageService: MessageService,
    public layoutService: LayoutService
  ) {
    this.initPrimeNg();
    this.localStorage.save('initTodo', this.initTodo);
  }

  ngOnInit() {
    this.readTodo('initTodo');
    this.layoutService.setPageLoading(false);
  }

  @ViewChild('dtExhibit') echibitRef: any;

  // table 欄位搜尋
  applyFilterGlobal($event: any, stringVal: any) {
    this.echibitRef.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  // 排序時間
  sortByTime(arr: []) {
    arr.sort((a: any, b: any) => {
      return <any>new Date(b.time) - <any>new Date(a.time);
    })
  }

  // 組裝 todo
  buildTodo(content: string) {
    let params = { tId: randomId(), content: content.trim(), time: moment().format('YYYY-MM-DD HH:mm:ss'), done: false };
    of(this.layoutService.setPageLoading(true)).pipe(
      tap(() => this.createTodo('initTodo', params)),
      tap(() => this.readTodo('initTodo')),
      tap(() => this.filterResult(this.filter)),
      tap(() => this.inputContent = ''),
      finalize(() => this.layoutService.setPageLoading(false)),
    ).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Create success',
        detail: '',
        icon: 'bounce animated',
        life: 3000,
      });
    })
  }

  // 準備更新
  doUpdate(rowData: any) {
    this.editTodo = rowData;
    this.editForm.patchValue({ content: rowData.content });
    this.displayEdit = true;

  }

  // 確認更新
  confirmUpdate() {
    of(this.layoutService.setPageLoading(true)).pipe(
      tap(() => this.updateTodo('initTodo', this.editTodo.tId, this.editForm.value.content)),
      tap(() => this.readTodo('initTodo')),
      tap(() => this.filterResult(this.filter)),
      tap(() => this.displayEdit = false),
      tap(() => this.editTodo = ''),
      finalize(() => this.layoutService.setPageLoading(false)),
    ).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Update success',
        detail: '',
        icon: 'bounce animated',
        life: 3000,
      });
    })
  }

  // 刪除
  prepareDelete(rowData: any) {
    this.confirmationService.confirm({
      key: 'confirm',
      header: `刪除`,
      icon: 'fa fa-trash',
      message: `是否要刪除「<strong>${rowData.tId}</strong>」？`,
      accept: () => {
        of(this.layoutService.setPageLoading(true)).pipe(
          tap(() => this.deleteTodo('initTodo', rowData.tId)),
          tap(() => this.readTodo('initTodo')),
          tap(() => this.filterResult(this.filter)),
          finalize(() => this.layoutService.setPageLoading(false)),
        ).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Delete success',
            detail: '',
            icon: 'bounce animated',
            life: 3000,
          });
        })
      },
      reject: () => {
      },
    });
  }

  // 初始化 畫面打勾
  initSelect() {
    this.selectedRows = this.shareList.filter((item: any) => item.done === true);
  }

  // 打勾完成
  selectRow(rowData: any) {
    of(this.layoutService.setPageLoading(true)).pipe(
      tap(() => this.closeTodo('initTodo', rowData.tId)),
      tap(() => this.readTodo('initTodo')),
      tap(() => this.filterResult(this.filter)),
      finalize(() => this.layoutService.setPageLoading(false)),
    ).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Done success',
        detail: '',
        icon: 'bounce animated',
        life: 3000,
      });
    })
  }


  createTodo(KEY: string, todo: object) {
    const todos: any = this.localStorage.load(KEY);
    todos.push(todo);
    this.localStorage.save(KEY, todos);
  }

  readTodo(KEY: string) {
    const todos: any = this.localStorage.load(KEY);
    this.sortByTime(todos);
    this.shareList = todos;
    this.initSelect();
  }

  updateTodo(KEY: string, tId: string, content: any) {
    let todos: any = this.localStorage.load(KEY);
    todos.map((item: any) => {
      if (item.tId === tId) { item.content = content }
      return item
    })
    this.editForm.reset();
    this.localStorage.save(KEY, todos);
  }

  deleteTodo(KEY: string, tId: string) {
    const todos: any = this.localStorage.load(KEY);
    let idx = todos.findIndex((item: any) => item.tId === tId);
    const spliceTodo = todos.splice(idx, 1);
    this.localStorage.save(KEY, todos);
    return spliceTodo;
  }


  closeTodo(KEY: string, tId: string) {
    let todos: any = this.localStorage.load(KEY);
    todos.map((item: any) => {
      if (item.tId === tId) { item.done = !item.done }
      return item
    })
    this.localStorage.save(KEY, todos);
  }


  // Todo分類
  filterResult(filter: string) {
    this.shareList = this.filterList(filter);
    this.sortByTime(this.shareList);
  }

  filterList(filter: string) {
    const todos: any = this.localStorage.load('initTodo');
    // all, active, done
    if (filter === 'all') { return todos; }
    if (filter === 'active') { return todos.filter((todo: any) => !todo.done) }
    if (filter === 'done') { return todos.filter((todo: any) => todo.done); }
    else { return todos; }
  }


  // primeng Init
  initPrimeNg() {
    this.primengConfig.ripple = true;
  }
}
