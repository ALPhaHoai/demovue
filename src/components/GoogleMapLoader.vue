<template>
  <vxe-modal v-model="showMap" :title="'Chọn địa chỉ'" width="800px" height="500px" min-width="600px"
             destroy-on-close>
    <template>
      <GmapMap
          :center="center"
          :zoom="18"
          map-style-id="roadmap"
          :options="mapOptions"
          style="width: 100%; height: calc(100% - 50px)"
          ref="mapRef"
          @click="handleMapClick"
      >
        <GmapMarker
            :position="markerPosition"
            :clickable="true"
            :draggable="true"
            @drag="handleMarkerDrag"
            @click="panToMarker"
        />
      </GmapMap>
      <vxe-form title-align="right" title-width="100">
        <vxe-form-item align="center" title-align="left" :span="24">
          <template #default>
            <vxe-button @click="handleSaveClick">Lưu</vxe-button>
            <vxe-button @click="showMap = false">Hủy</vxe-button>
          </template>
        </vxe-form-item>
      </vxe-form>
    </template>
  </vxe-modal>

</template>

<script>
import axios from 'axios'

export default {
  props: {
    mapConfig: Object,
    markerPosition: Object,
    apiKey: String,
    showMap: Boolean,
    onSave: Function,
  },
  data() {
    return {
      google: null,
      map: null,
      center: {lat: 45.508, lng: -73.587},
      mapOptions: {
        disableDefaultUI: true,
      },
    }
  },
  async mounted() {
    this.geolocate();
  },
  methods: {
    geolocate() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.markerPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.panToMarker();
      });
    },

    async geocodedAddress(cb) {
      try {
        var {
          data
        } = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
            this.markerPosition.lat +
            "," +
            this.markerPosition.lng +
            "&key=AIzaSyCjQvIh3y9_svxMWIX-DetxqOz3-qMbqxY"
        );
        if (data.error_message) {
          console.log(data.error_message)
          this.markerPosition.address = '42 Trung Yên 14, Trung Hoà, Cầu Giấy, Hà Nội'
        } else {
          this.markerPosition.address = data.results[0].formatted_address;
        }
        cb()
      } catch (error) {
        console.log(error.message);
        cb()
      }
    },

    handleMarkerDrag(e) {
      this.markerPosition = {lat: e.latLng.lat(), lng: e.latLng.lng()};
    },

    panToMarker() {
      this?.$refs?.mapRef?.panTo(this.markerPosition);
      this?.$refs?.mapRef?.setZoom(18);
    },

    handleMapClick(e) {
      this.markerPosition = {lat: e.latLng.lat(), lng: e.latLng.lng()};
      console.log(e);
    },

    handleSaveClick() {
      const vm = this
      vm.geocodedAddress(function () {
        vm.showMap = false
        vm.$emit('changeAddress', vm?.markerPosition)
      })
    },
  }
}

</script>

<style scoped>
.google-map {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>