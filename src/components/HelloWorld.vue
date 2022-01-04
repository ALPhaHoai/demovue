<template>
  <el-container style="height: 90vh; border: 1px solid #eee">
    <el-container>
      <el-main style="display: flex; flex-direction: column">
        <el-button type="primary" style="float: left; width: fit-content" @click="addEvent()">Add</el-button>
        <div style="float: left; margin-top: 10px">
          <vxe-table
              height="500"
              :data="tableData"
              :resizable="true"
              @cell-menu="cellContextMenuEvent"
              :menu-config="menuConfig"
              :row-config="{isCurrent: true, isHover: true}"
              :checkbox-config="{}"
              :sort-config="{}"
              :loading="loading"
              ref="_table"
          >
            <vxe-column type="checkbox" width="70"></vxe-column>
            <vxe-column sortable field="name" title="Tên" width="150"></vxe-column>
            <vxe-column sortable field="age" title="Tuổi" width="80"></vxe-column>
            <vxe-column sortable field="address" title="Địa chỉ" width="400"></vxe-column>
            <vxe-column title="Action" width="200" show-overflow>
              <template #default="{ row }">
                <el-button @click="editEvent(row)">Edit</el-button>
                <el-popconfirm
                    confirm-button-text='OK'
                    cancel-button-text='No, Thanks'
                    icon-color="red"
                    title="Are you sure to delete this?"
                    @confirm="removeEvent(row)"
                >
                  <el-button slot="reference">Delete</el-button>
                </el-popconfirm>

              </template>
            </vxe-column>
          </vxe-table>
        </div>

        <vxe-modal v-model="showEdit" :title="selectRow ? 'Sửa' : 'Thêm'" width="800" min-width="600" min-height="300"
                   :loading="submitLoading" resize destroy-on-close>
          <template #default>
            <vxe-form :data="formData" title-align="right" title-width="100" @submit="submitEvent">
              <vxe-form-item field="name" title="Name" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-input v-model="data.name" placeholder=""></vxe-input>
                </template>
              </vxe-form-item>

              <vxe-form-item field="role" title="Địa chỉ" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <el-input
                      @click.native="onAddressInputEvent"
                      readonly
                      v-model="data.address"
                      placeholder="Chọn địa chỉ"
                      suffix-icon="el-icon-map-location"
                  >
                  </el-input>
                </template>
              </vxe-form-item>
              <vxe-form-item field="age" title="Age" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-input v-model="data.age" type="number" placeholder=""></vxe-input>
                </template>
              </vxe-form-item>
              <vxe-form-item align="center" title-align="left" :span="24">
                <template #default>
                  <vxe-button type="submit">Lưu</vxe-button>
                  <vxe-button @click="onCancelEvent">Hủy</vxe-button>
                </template>
              </vxe-form-item>
            </vxe-form>
          </template>
        </vxe-modal>

        <GoogleMapLoader
            :showMap="showMap"
            @changeAddress="onReiceveAddressEvent"
            style="width: 400px; height: 500px"
        />
      </el-main>
    </el-container>
  </el-container>


</template>

<style>

</style>

<script>

import _ from 'lodash';
import GoogleMapLoader from "@/components/GoogleMapLoader";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    GoogleMapLoader
  },
  data() {
    return {
      tableData: [],
      menuConfig: {
        header:
            {
              disabled: false, options: {
                name: 'xxxxx'
              }
            }
      },
      loading: false,
      formData: {
        id: null,
        name: null,
        age: null,
        address: null,
      },
      showEdit: false,
      showMap: false,
      markerPosition: {
        lat: null, lng: null
      },
      selectRow: null,
      submitLoading: false,

    }
  },
  methods: {
    onCancelEvent() {
      this.showEdit = false
      this.showMap = false
    },
    onReiceveAddressEvent(pos) {
      console.log(pos.lat)
      console.log(pos.lng)
      console.log(pos.address)
      this.showMap = false
      this.formData.address = pos.address
    },
    cellContextMenuEvent(row) {
      console.log(row)
    },
    checCheckboxkMethod2({row}) {
      return row.age > 26
    },
    showCheckboxkMethod2({row}) {
      return row.name === 'JJJ'
    },
    editEvent(row) {
      this.formData = {
        name: row.name,
        age: row.age,
        address: row.address
      }
      this.selectRow = row
      this.showEdit = true
    },
    async onAddressInputEvent() {
      if (this.showMap) {
        this.showMap = false
      }
      this.showMap = true
    },
    async removeEvent(row) {
      this.$refs._table.remove(row)
      this.saveDataTable(this.$refs._table.getTableData().fullData)
      this.$message('Xóa thành công');
    },
    addEvent() {
      this.formData = {
        name: '',
        age: '',
        address: ''
      }
      this.selectRow = null
      this.showEdit = true
      this.saveDataTable(this.$refs._table.getTableData().fullData)
    },
    async submitEvent() {
      const vm = this
      vm.submitLoading = true
      const $table = this.$refs._table
      await (new Promise(function (resolve) {
        setTimeout(() => {
          resolve()
        }, 500)
      }))
      this.submitLoading = false
      this.showEdit = false
      this.showMap = false
      if (this.selectRow) {
        Object.assign(this.selectRow, this.formData)
        this.$message('Sửa thành công');
      } else {
        let id = 0
        const data = $table.getTableData().fullData
        for (let i = 0; i < data.length; i++) {
          if (id <= data[i].id) {
            id = data[i].id + 1
          }
        }

        this.formData.id = id
        const {row: newRow} = await $table.insertAt(this.formData, -1)
        await $table.setActiveRow(newRow)
        this.$message('Thêm thành công');
      }
      vm.saveDataTable($table.getTableData().fullData)
    },
    saveDataTable(tableData) {
      const _tableData = []
      tableData.forEach(function (item) {
        let _item = Object.assign({}, item);
        delete _item._X_ID
        _tableData.push(_item)
      })

      const parsed = JSON.stringify(_.sortBy(_tableData, 'id'));
      localStorage.setItem('tableData', parsed);
    }
  },
  created() {
    this.loading = true
    setTimeout(() => {
      const defaultTableData = [
        {id: 1, name: 'Lê Văn A', age: 15, address: 'Trung yen'},
        {id: 2, name: 'Lê Văn B', age: 16, address: 'Trung yen'},
        {id: 3, name: 'Lê Văn C', age: 17, address: 'Trung yen'},
        {id: 4, name: 'Lê Văn D', age: 18, address: 'Trung yen'},
      ];
      if (localStorage.tableData) {
        const tableData = JSON.parse(localStorage.tableData);
        this.tableData = Array.isArray(tableData) ? tableData : defaultTableData
      } else {
        this.tableData = defaultTableData
      }
      this.loading = false
    }, 1000)
  },
  mounted() {

  },
  computed: {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
