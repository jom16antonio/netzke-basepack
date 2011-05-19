Ext.ns("Netzke.pre");
Ext.ns("Netzke.pre.Basepack");
Ext.ns("Ext.ux.grid");

Ext.apply(Ext.History, new Ext.util.Observable());

// A convenient passfield
// Ext.netzke.PassField = Ext.extend(Ext.form.TextField, {
//   inputType: 'password'
// });
// Ext.reg('passfield', Ext.netzke.PassField);

// Ext.override(Ext.ux.form.DateTimeField, {
//   format: "Y-m-d",
//   timeFormat: "g:i:s",
//   picker: {
//     minIncremenet: 15
//   }
// });

// ComboBox that gets options from the server (used in both grids and panels)
Ext.define('Ext.netzke.ComboBox', {
  extend        : 'Ext.form.field.ComboBox',
  alias         : 'widget.netzkeremotecombo',
  valueField    : 'field1',
  displayField  : 'field2',
  triggerAction : 'all',
  // WIP: Breaking - should not be 'true' if combobox is not editable
  // typeAhead     : true,

  initComponent : function(){

    var modelName = this.parentId + "_" + this.name;

    Ext.define(modelName, {
        extend: 'Ext.data.Model',
        fields: ['field1', 'field2']
    });

    var store = new Ext.data.Store({
      model: modelName,
      proxy: {
        type: 'direct',
        directFn: Netzke.providers[this.parentId].getComboboxOptions,
        reader: {
          type: 'array',
          root: 'data'
        }
      }
    });

    // TODO: find a cleaner way to pass this.name to the server
    store.on('beforeload', function(self, params) {
      params.params.column = this.name;
    },this);

    // If inline data was passed
    if (this.store) store.loadData({data: this.store});

    this.store = store;

    this.callParent();

    // var parent = Ext.getCmp(this.parentId);
    // // Is parent a grid?
    // if (parent.getSelectionModel) {
    //   this.on('beforequery',function(qe) {
    //     delete qe.combo.lastQuery;
    //   },this);
    // }
    //
    // // A not-so-clean approach to submit the current record id
    // store.on('beforeload',function(store, options){
    //   if (parent.getSelectionModel) {
    //     var selected = parent.getSelectionModel().getSelected();
    //     if (selected) options.params.id = selected.id;
    //   } else {
    //     // TODO: also for the FormPanel
    //   }
    // }, this);
  },
  collapse: function(){
    // HACK: do not hide dropdown menu while loading items
    if( !this.store.loading ) this.callParent();
  }
});

Ext.util.Format.mask = function(v){
  return "********";
};

// Ext.netzke.JsonField = Ext.extend(Ext.form.TextField, {
//   validator: function(value) {
//     try{
//       var d = Ext.decode(value);
//       return true;
//     } catch(e) {
//       return "Invalid JSON"
//     }
//   }
//
//   ,setValue: function(value) {
//     this.setRawValue(Ext.encode(value));
//   }
//
// });
//
// Ext.reg('jsonfield', Ext.netzke.JsonField);
//
// Ext.grid.HeaderDropZone.prototype.onNodeDrop = function(n, dd, e, data){
//     var h = data.header;
//     if(h != n){
//         var cm = this.grid.colModel;
//         var x = Ext.lib.Event.getPageX(e);
//         var r = Ext.lib.Dom.getRegion(n.firstChild);
//         var pt = (r.right - x) <= ((r.right-r.left)/2) ? "after" : "before";
//         var oldIndex = this.view.getCellIndex(h);
//         var newIndex = this.view.getCellIndex(n);
//         if(pt == "after"){
//             newIndex++;
//         }
//         if(oldIndex < newIndex){
//             newIndex--;
//         }
//         cm.moveColumn(oldIndex, newIndex);
//         return true;
//     }
//     return false;
// };
//
//
// Ext.ns('Ext.ux.form');
// Ext.ux.form.TriCheckbox = Ext.extend(Ext.form.Checkbox, {
//   checked: null,
//   valueList: [null, false, true],
//   stateClassList: ['x-checkbox-undef', null, 'x-checkbox-checked'],
//   overClass: 'x-form-check-over',
//   clickClass: 'x-form-check-down',
//   triState: true,
//   defaultAutoCreate: {tag: 'input', type: 'hidden', autocomplete: 'off'},
//   initComponent: function() {
//     this.value = this.checked;
//     Ext.ux.form.TriCheckbox.superclass.initComponent.apply(this, arguments);
//     // make a copy before modifying valueList and stateClassList arrays
//     this.vList = this.valueList.slice(0);
//     this.cList = this.stateClassList.slice(0);
//     if(this.triState !== true) {
//       // consider 'undefined' value and its class go first in arrays
//       this.vList.shift();
//       this.cList.shift();
//     }
//     if(this.overCls !== undefined) {
//       this.overClass = this.overCls;
//       delete this.overCls;
//     }
//     this.value = this.normalizeValue(this.value);
//   },
//   onRender : function(ct, position){
//     Ext.form.Checkbox.superclass.onRender.call(this, ct, position);
//
//     this.innerWrap = this.el.wrap({tag: 'span', cls: 'x-form-check-innerwrap'});
//     this.wrap = this.innerWrap.wrap({cls: 'x-form-check-wrap'});
//
//     this.currCls = this.getCls(this.value);
//     this.wrap.addClass(this.currCls);
//     if(this.clickClass && !this.disabled && !this.readOnly)
//       this.innerWrap.addClassOnClick(this.clickClass);
//     if(this.overClass && !this.disabled && !this.readOnly)
//       this.innerWrap.addClassOnOver(this.overClass);
//
//     this.imageEl = this.innerWrap.createChild({
//       tag: 'img',
//       src: Ext.BLANK_IMAGE_URL,
//       cls: 'x-form-tscheckbox'
//     }, this.el);
//     if(this.fieldClass) this.imageEl.addClass(this.fieldClass);
//
//     if(this.boxLabel){
//       this.innerWrap.createChild({
//         tag: 'label',
//         htmlFor: this.el.id,
//         cls: 'x-form-cb-label',
//         html: this.boxLabel
//       });
//     }
//
//     // Need to repaint for IE, otherwise positioning is broken
//     if(Ext.isIE){
//       this.wrap.repaint();
//     }
//     this.resizeEl = this.positionEl = this.wrap;
//   },
//   onResize : function(){
//     Ext.form.Checkbox.superclass.onResize.apply(this, arguments);
//     if(!this.boxLabel && !this.fieldLabel && this.imageEl){
//       this.imageEl.alignTo(this.wrap, 'c-c');
//     }
//   },
//   initEvents : function(){
//     Ext.form.Checkbox.superclass.initEvents.call(this);
//     this.mon(this.innerWrap, {
//       scope: this,
//       click: this.onClick
//     });
//   },
//   onClick : function(){
//     if (!this.disabled && !this.readOnly) {
//       this.setValue(this.vList[(this.vList.indexOf(this.value) + 1) % this.vList.length]);
//     }
//   },
//   getValue : function(){
//     return this.value;
//   },
//   setValue : function(v){
//     var value = this.value;
//     this.value = this.normalizeValue(v);
//     if(this.rendered) this.el.dom.value = this.value;
//
//     if(value !== this.value){
//       this.updateView();
//       this.fireEvent('check', this, this.value);
//       if(this.handler) this.handler.call(this.scope || this, this, this.value);
//     }
//     return this;
//   },
//   normalizeValue: function(v) {
//     return (v === null || v === undefined) && this.triState ? null :
//       (v === true || (['true', 'yes', 'on', '1']).indexOf(String(v).toLowerCase()) != -1);
//   },
//   getCls: function(v) {
//     var idx = this.vList.indexOf(this.value);
//     return idx > -1 ? this.cList[idx] : undefined;
//   },
//   updateView: function() {
//     var cls = this.getCls(this.value);
//     if (!this.wrap || cls === undefined) return;
//
//     this.wrap.replaceClass(this.currCls, cls);
//     this.currCls = cls;
//   }
// });
// Ext.reg('tricheckbox', Ext.ux.form.TriCheckbox);

// Enabling checkbox submission when unchecked
// TODO: it would be nice to standardize return values
//  because currently checkboxes return "on", if checked,
//  and boolean 'false' otherwise. It's not nice
//  MAV
//  TODO: maybe we should simply initialize 'uncheckedValue' somewhere else,
//  instead
Ext.override( Ext.form.field.Checkbox, {
  getSubmitValue: function() {
    return this.callOverridden() || false; // 'off';
  }
});

// WIP: we dont need this any longer because we can submit unchecked values
//  using either Ext.form.field.uncheckedValue = 'off' (for example)
//  or by means of overriding field's getSubmitValue
//  MAV
// (function() {
//   origCheckboxRender = Ext.form.Checkbox.prototype.onRender;
//   origCheckboxSetValue = Ext.form.Checkbox.prototype.setValue;

//   Ext.override(Ext.form.Checkbox, {
//     onRender: function() {
//       // call the original onRender() function
//       origCheckboxRender.apply(this, arguments);

//       if (this.getXType() === 'radio') return;

//       // Handle initial case based on this.checked
//       if (this.checked == false) {
//         this.noValEl = Ext.DomHelper.insertAfter(this.el, {
//             tag: 'input',
//             type: 'hidden',
//             value: false,
//             name: this.getName()
//         }, true);
//       }
//       else {
//         this.noValEl = null;
//       }
//     },
//     setValue: function() {
//       // call original setValue() function
//       origCheckboxSetValue.apply(this, arguments);

//       if (this.getXType() === 'radio') return;

//       if (this.checked) {
//         if (this.noValEl != null) {
//           // Remove the extra hidden element
//           this.noValEl.remove();
//           this.noValEl = null;
//         }
//       }
//       else {
//         // Add our hidden element for (unchecked) value
//         if (this.noValEl == null) this.noValEl = Ext.DomHelper.insertAfter(this.el, {
//             tag: 'input',
//             type: 'hidden',
//             value: false,
//             name: this.getName()
//         }, true);
//       }
//     }
//   });
// })();

