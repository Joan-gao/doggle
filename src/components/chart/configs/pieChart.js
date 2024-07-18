export const data = [
  {
    type: 'Food',
    value: 25,
  },
  {
    type: 'Sports',
    value: 25,
  },
  {
    type: 'Shooping',
    value: 30,
  },
  {
    type: 'Study',
    value: 15,
  },
];

export const config = {
  appendPadding: [10, 10, 10, 10], // 调整图表内边距，使其更紧凑
  radius: 0.8,
  data,
  angleField: 'value',
  colorField: 'type',
  label: {
    type: 'spider', // 选择spider布局，使标签更紧凑
    labelHeight: 28,
  },
  interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  legend: {
    position: 'right',
  },
};
