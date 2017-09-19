const th = {
  textAlign: 'center',
  verticalAlign: 'middle',
  border: 0,
};

const td = {...th};

export default {
  swatchInfo: {
    margin: '1em',
    padding: '.5em',
    fontSize: '8px',
    borderRadius: '3px',
    background: '#000',
    color: '#fff',
    opacity: 0.3,
  },
  tableWrap: {
    overflow: 'auto',
  },
  table: {
    borderCollapse: 'collapse',
  },
  theadTh: {
    ...th,
  },
  th,
  td,
};
