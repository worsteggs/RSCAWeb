<template>
  <!-- 包含四宫格布局的外层容器 -->
  <div class="wrap">
    <div>
      <b-pane>
        <el-row :gutter="5" type="flex" justify="center">
          <el-col :md="8" :sm="24" class="center-col">
            <DatasetTab v-model="params.region" :data="regionData" @change="regionChange" />
          </el-col>
          <el-col :md="8" :sm="24" class="center-col">
            <RegionTab v-model="params.cellType" :data="cellTypeData" @change="cellTypeChange" />
          </el-col>
          <el-col :md="4" :sm="4" :xs="8" class="center-col">
            <el-button type="primary" class="mb10" @click="getParams">Submits</el-button>
          </el-col>
        </el-row>
      </b-pane>
    </div>
    <!-- 使用 Grid 布局的容器 -->
    <div class="grid-container">
      <!-- 左上区域 -->
      <div class="grid-item">
        <b-pane label="">
          <!-- ATLAS 组件放置在左上区域 -->
          <!-- <atlasBrains isGene @change="changeAtlas" /> -->
          <el-row :gutter="10" type="flex" align="bottom">
            <el-col :md="8" :sm="24" class="mb10">
              <colorbyTab v-model="params.region" :data="regionData" @change="regionChange" />
            </el-col>
            <!-- <el-col :md="8" :sm="24" class="mb10">
          <cellType v-model="params.cellType" :data="cellTypeData" @change="cellTypeChange" />
            </el-col>-->
          </el-row>
          <Plotly :data="data" :layout="layout" :display-mode-bar="false"></Plotly>
        </b-pane>
      </div>
      <!-- 右上区域 -->
      <div class="grid-item">
        <!-- 右上区域的内容 -->
        <b-pane label>
          <el-row :gutter="10" type="flex" align="bottom">
            <!-- <el-col :md="8" :sm="24" class="mb10">
          <markerRegion v-model="params.region" :data="regionData"  @change="regionChange" />
            </el-col>-->
            <el-col :md="8" :sm="24" class="mb10">
              <FeaturesTab v-model="params.cellType" :data="cellTypeData" @change="cellTypeChange" />
            </el-col>
          </el-row>
          <Plotly :data="data" :layout="layout" :display-mode-bar="false"></Plotly>
        </b-pane>
      </div>
      <!-- 左下区域 -->
      <div class="grid-item">
        <!-- 左下区域的内容 -->
        <b-pane label="Cell type ratio">
          <!-- ATLAS 组件放置在左上区域 -->
          <atlasBrains isGene @change="changeAtlas" />
        </b-pane>
      </div>
      <!-- 右下区域 -->
      <div class="grid-item">
        <!-- 右下区域的内容 -->
        <b-pane label="Expression">
          <!-- ATLAS 组件放置在左上区域 -->
          <atlasBrains isGene @change="changeAtlas" />
        </b-pane>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 默认展示的：
ByRegion:
Adult_Cerebellum_Oligodendrocyte
Fetal_Prefrontal cortex_Glioblast
Tumour_Pons_Astrocyte
Organoid_Pons_Committed oligodendrocyte precursor
 * byCellType:
Adult_Cingulate cortex_Medium spiny neuron
Fetal_Cerebral cortex_Neural crest
Tumour_Frontal lobe_Oligodendrocyte
Organoid_Cortex_Ependymal
 */
const staticParams = {
  AdultRegion: {
    atlas: "Adult",
    region: "Piriform cortex",
    cellType: "Eccentric medium spiny neuron"
  },
  FetalRegion: {
    atlas: "Fetal",
    region: "Prefrontal cortex",
    cellType: "Glioblast"
  },
  TumourRegion: { atlas: "Tumour", region: "Pons", cellType: "Astrocyte" },
  OrganoidRegion: {
    atlas: "Organoid",
    region: "Pons",
    cellType: "Committed oligodendrocyte precursor"
  },
  MouseRegion: { atlas: "Mouse", region: "", cellType: "" },
  AdultCellType: {
    atlas: "Adult",
    region: "Cingulate cortex",
    cellType: "Medium spiny neuron"
  },
  FetalCellType: {
    atlas: "Fetal",
    region: "Cerebral cortex",
    cellType: "Neural crest"
  },
  TumourCellType: {
    atlas: "Tumour",
    region: "Frontal lobe",
    cellType: "Oligodendrocyte"
  },
  OrganoidCellType: {
    atlas: "Organoid",
    region: "Cortex",
    cellType: "Ependymal"
  },
  MouseCellType: { atlas: "Mouse", region: "", cellType: "" }
};

import VolcanoByCellType from "@/utils/VolcanoByCellType.json";
import VolcanoByRegion from "@/utils/VolcanoByRegion.json";
import { Plotly } from "vue-plotly";
export default {
  name: "GeneMarker",
  components: {
    // atlasBrains: () => import("@/views/index/components/atlasBrains.vue"),
    DatasetTab: () => import("./components/DatasetTab.vue"),
    RegionTab: () => import("./components/RegionTab.vue"),
    colorbyTab: () => import("./components/colorbyTab.vue"),
    FeaturesTab: () => import("./components/FeaturesTab.vue"),
    // geneMethod: () => import("./components/geneMethod.vue"),
    // markers: () => import("./components/markers.vue"),
    Plotly
  },
  data() {
    return {
      params: {
        atlas: "Adult",
        region: "Cerebellum",
        cellType: "Oligodendrocyte"
      },
      atlasMarkerBtn: "Region",
      regionData: [],
      cellTypeData: [],
      byRegionTips:
        " cell type compared to others in the selected brain region.",
      byCelltypeTips:
        " brain region compared to others in the selected cell type.",
      data: [
        {
          x: [1, 2, 3, 4],
          y: [10, 15, 13, 17],
          type: "scatter"
        }
      ],
      layout: {
        title: "My graph"
      }
    };
  },
  watch: {
    // 'params.atlas': {
    //   handler (val) {
    //     if (this.atlasMarkerBtn == 'Region') {
    //       this.regionData = VolcanoByRegion[val] ? Object.keys(VolcanoByRegion[val]) : []
    //       this.cellTypeData = []
    //     } else {
    //       this.cellTypeData = VolcanoByCellType[val] ? Object.keys(VolcanoByCellType[val]) : []
    //       this.regionData = []
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
  },
  methods: {
    regionChange(val) {
      console.log("regionChange", val);
      this.cellTypeData = VolcanoByRegion[this.params.atlas]
        ? VolcanoByRegion[this.params.atlas][val]
        : [];
    },
    cellTypeChange(val) {
      this.regionData = VolcanoByCellType[this.params.atlas]
        ? VolcanoByCellType[this.params.atlas][val]
        : [];
    },
    getParams() {
      this.$refs.markers.fetchMarkers(this.params);
    },
    setAtlasMarkerBtn(val) {
      this.atlasMarkerBtn = val;
      this.resetParams(this.params.atlas);
    },
    changeAtlas(val) {
      const atlas = val.name.split(" ")[0];
      this.resetParams(atlas);
    },
    resetParams(atlasValue) {
      const { atlas = atlasValue, region = "", cellType = "" } =
        staticParams[`${atlasValue}${this.atlasMarkerBtn}`] ?? {}; //获取默认的参数
      if (this.atlasMarkerBtn == "Region") {
        this.regionData = VolcanoByRegion[atlas]
          ? Object.keys(VolcanoByRegion[atlas])
          : [];
        this.regionChange(region);
      } else {
        this.cellTypeData = VolcanoByCellType[atlas]
          ? Object.keys(VolcanoByCellType[atlas])
          : [];
        this.cellTypeChange(cellType);
      }
      // debugger;
      this.params = { atlas, region, cellType };
      console.log("resetParams", this.params, atlasValue);
      this.$nextTick(() => {
        setTimeout(() => {
          this.getParams();
        }, 300);
      });
    }
  },

  mounted() {
    // setTimeout(() => {
    this.resetParams("Adult");
    // }, 300);
  }
};
</script>
<style lang="scss" scoped>
/* Grid 布局容器样式 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列，每列占据相等空间 */
  grid-template-rows: repeat(2, 1fr); /* 两行，每行占据相等空间 */
  gap: 10px; /* 格子之间的间距，根据需要调整 */
}
.banner {
  background-color: #3498db;
  color: #fff;
  text-align: center;
  padding: 20px;
}
.center-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
