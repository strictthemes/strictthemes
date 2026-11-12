export type Status = "In transit" | "Delivered" | "Late" | "Held"

export type Shipment = {
  id: string
  customer: string
  destination: string
  depot: string
  status: Status
  weight: number
  value: number
  updated: string // ISO date and time, local
}

export const DEPOTS = ["Leeds Hub", "York", "Hull", "Harrogate"] as const

export const STATUSES: Status[] = ["In transit", "Delivered", "Late", "Held"]

export const SHIPMENTS: Shipment[] = [
  { id: "NG-48213", customer: "Brackwood Tiles", destination: "Wakefield", depot: "Leeds Hub", status: "In transit", weight: 18.4, value: 1240, updated: "2026-11-11T14:05" },
  { id: "NG-48207", customer: "Fellside Outdoor", destination: "Skipton", depot: "Harrogate", status: "Delivered", weight: 3.2, value: 189.5, updated: "2026-11-11T13:48" },
  { id: "NG-48199", customer: "Moorend Pharmacy", destination: "Beverley", depot: "Hull", status: "Late", weight: 1.1, value: 74.2, updated: "2026-11-11T13:20" },
  { id: "NG-48196", customer: "Ouse Valley Print", destination: "Selby", depot: "York", status: "In transit", weight: 12.75, value: 512, updated: "2026-11-11T12:57" },
  { id: "NG-48190", customer: "Calder & Finch", destination: "Halifax", depot: "Leeds Hub", status: "Held", weight: 26, value: 2310, updated: "2026-11-11T12:31" },
  { id: "NG-48184", customer: "Thornbury Bikes", destination: "Ripon", depot: "Harrogate", status: "Delivered", weight: 14.6, value: 865.99, updated: "2026-11-11T11:42" },
  { id: "NG-48179", customer: "Saltmarsh Foods", destination: "Bridlington", depot: "Hull", status: "In transit", weight: 9.3, value: 146.8, updated: "2026-11-11T11:05" },
  { id: "NG-48175", customer: "Kettle Lane Books", destination: "Malton", depot: "York", status: "Delivered", weight: 4.8, value: 98, updated: "2026-11-11T10:36" },
  { id: "NG-48168", customer: "Greyfriars Dental", destination: "Pudsey", depot: "Leeds Hub", status: "Late", weight: 2.05, value: 432.6, updated: "2026-11-11T09:58" },
  { id: "NG-48162", customer: "Highmoor Joinery", destination: "Knaresborough", depot: "Harrogate", status: "In transit", weight: 31.5, value: 1785, updated: "2026-11-11T09:14" },
  { id: "NG-48157", customer: "Wolds Garden Supply", destination: "Driffield", depot: "Hull", status: "Delivered", weight: 22.9, value: 304.4, updated: "2026-11-11T08:40" },
  { id: "NG-48151", customer: "Minster Lighting", destination: "Tadcaster", depot: "York", status: "Held", weight: 7.6, value: 1120, updated: "2026-11-11T08:02" },
  { id: "NG-48144", customer: "Aire Street Coffee", destination: "Bradford", depot: "Leeds Hub", status: "Delivered", weight: 5.5, value: 67.25, updated: "2026-11-10T17:46" },
  { id: "NG-48139", customer: "Nidd Valley Cycles", destination: "Pateley Bridge", depot: "Harrogate", status: "Late", weight: 16.2, value: 940, updated: "2026-11-10T17:12" },
  { id: "NG-48133", customer: "Humber Marine Parts", destination: "Goole", depot: "Hull", status: "In transit", weight: 41.3, value: 2875.5, updated: "2026-11-10T16:30" },
  { id: "NG-48128", customer: "Shambles Gifts", destination: "Pickering", depot: "York", status: "Delivered", weight: 1.9, value: 52.99, updated: "2026-11-10T15:54" },
  { id: "NG-48121", customer: "Roundhay Florists", destination: "Otley", depot: "Leeds Hub", status: "In transit", weight: 6.4, value: 118, updated: "2026-11-10T15:09" },
  { id: "NG-48117", customer: "Stray Wine Cellars", destination: "Wetherby", depot: "Harrogate", status: "Held", weight: 19.8, value: 1462.4, updated: "2026-11-10T14:23" },
  { id: "NG-48110", customer: "Holderness Farm Shop", destination: "Hornsea", depot: "Hull", status: "Delivered", weight: 11, value: 209.7, updated: "2026-11-10T13:41" },
  { id: "NG-48104", customer: "Clifford Optics", destination: "Easingwold", depot: "York", status: "Late", weight: 0.8, value: 655, updated: "2026-11-10T12:50" },
  { id: "NG-48098", customer: "Kirkstall Music", destination: "Morley", depot: "Leeds Hub", status: "Delivered", weight: 8.7, value: 389.9, updated: "2026-11-10T11:36" },
  { id: "NG-48092", customer: "Valley Gardens Pottery", destination: "Thirsk", depot: "Harrogate", status: "In transit", weight: 13.1, value: 274.5, updated: "2026-11-10T10:18" },
  { id: "NG-48087", customer: "Spurn Point Surf", destination: "Withernsea", depot: "Hull", status: "In transit", weight: 24.6, value: 1590, updated: "2026-11-10T09:27" },
  { id: "NG-48081", customer: "Walmgate Stationers", destination: "Pocklington", depot: "York", status: "Delivered", weight: 3.6, value: 81.4, updated: "2026-11-10T08:15" },
]
