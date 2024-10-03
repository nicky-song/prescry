// Copyright 2022 Prescryptive Health, Inc.

import { Spacing } from '@phx/common/src/theming/spacing';
import { Content, ContentTable } from 'pdfmake/interfaces';
import {
  buildPdfHeader,
  buildPdfServiceHeader,
  IPdfServiceHeaderContent,
  IPdfServiceHeaderProps,
} from './pdf-header.helper';

describe('pdfHeaderHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buildPdfHeader', () => {
    it('builds header', () => {
      const header = buildPdfHeader();

      const expectedHeader = {
        svg: '<svg width="123" height="20" viewBox="0 0 123 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M94.0692 0.0882292C93.9316 0.0305563 93.784 0.000572931 93.6348 0L93.6392 0.0131581C93.4923 0.0143028 93.3471 0.0443997 93.2119 0.101722C93.0767 0.159044 92.9542 0.242463 92.8513 0.347192C92.7485 0.451921 92.6674 0.575898 92.6127 0.712008C92.5579 0.848118 92.5306 0.993682 92.5324 1.14035C92.5306 1.28561 92.5579 1.42976 92.6126 1.56436C92.6674 1.69896 92.7484 1.82131 92.8511 1.92424C92.9538 2.02716 93.076 2.1086 93.2105 2.16378C93.3451 2.21897 93.4894 2.24678 93.6348 2.24561C93.7817 2.24734 93.9275 2.2201 94.0638 2.16544C94.2001 2.11078 94.3243 2.02978 94.4291 1.92709C94.534 1.8244 94.6176 1.70204 94.675 1.56703C94.7324 1.43202 94.7625 1.28702 94.7637 1.14035C94.7648 0.991378 94.7365 0.843647 94.6804 0.705631C94.6242 0.567614 94.5413 0.442028 94.4364 0.336079C94.3315 0.230129 94.2067 0.145902 94.0692 0.0882292ZM94.2937 4.61402H93.0331V14.7017H94.2937V4.61402ZM89.9227 5.80714H86.4967V11.3291C86.4343 11.9237 86.5904 12.5206 86.936 13.0089C87.1434 13.2474 87.403 13.4352 87.6947 13.5576C87.9864 13.6801 88.3024 13.7339 88.6182 13.715C88.9842 13.7209 89.3492 13.6766 89.7031 13.5834L89.9227 14.7325C89.4935 14.8506 89.0502 14.9096 88.605 14.908C88.098 14.9305 87.5924 14.8389 87.1256 14.64C86.6588 14.4411 86.2427 14.14 85.9082 13.7589C85.469 13.2062 85.223 12.4782 85.223 11.2852V5.80714H82.4031V4.61416H85.2318V1.87733H86.4923V4.61416H89.9183L89.9227 5.80714ZM17.2877 5.60932H17.8851L18.0608 4.41196C17.929 4.39003 17.4854 4.3681 17.3097 4.3681C16.6942 4.35428 16.0844 4.48711 15.5306 4.75559C14.9768 5.02408 14.4951 5.42048 14.1253 5.91195V4.59617H12.8647V14.6839H14.1253V7.83739C14.3761 7.19763 14.8094 6.64546 15.3716 6.24939C15.9338 5.85331 16.6 5.63076 17.2877 5.60932ZM0 4.64917V20H1.28255V13.2851C1.71179 13.8169 2.25805 14.2428 2.8789 14.5296C3.49974 14.8163 4.17844 14.9563 4.86226 14.9386C5.94001 14.9468 6.99288 14.6153 7.87097 13.9912C8.55093 13.5004 9.10128 12.852 9.47466 12.1017C9.84804 11.3515 10.0333 10.5218 10.0144 9.68424C10.0212 8.90106 9.85653 8.12586 9.5318 7.41294C9.20706 6.70001 8.73017 6.0666 8.13451 5.55706C7.22488 4.82871 6.0941 4.43118 4.92814 4.42987C4.23339 4.4217 3.54483 4.56096 2.90802 4.83845C2.27122 5.11594 1.7007 5.52533 1.23423 6.03952V4.64917H0ZM2.76454 13.1046C2.13175 12.7193 1.61274 12.1732 1.26058 11.522V7.6053C1.65266 6.99714 2.18791 6.49409 2.81957 6.1401C3.45123 5.78612 4.16009 5.59197 4.88422 5.57461C5.77171 5.58171 6.63017 5.89117 7.31754 6.4518C7.77449 6.84884 8.13815 7.34162 8.38261 7.89502C8.62707 8.44843 8.74631 9.04886 8.73186 9.65354C8.75491 10.1764 8.67207 10.6986 8.48828 11.1888C8.30449 11.6789 8.02355 12.127 7.66226 12.5062C7.30097 12.8854 6.86677 13.1879 6.38565 13.3956C5.90454 13.6033 5.3864 13.7119 4.86226 13.7149C4.12124 13.7005 3.39734 13.4899 2.76454 13.1046ZM28.5897 13.0484C28.0867 13.6446 27.4563 14.1208 26.7449 14.4418C26.0335 14.7629 25.259 14.9207 24.4785 14.9037C21.6499 14.9037 19.4142 12.7853 19.4142 9.64056C19.4142 6.75022 21.382 4.37742 24.2457 4.37742C26.9426 4.37742 28.9323 6.49584 28.9323 9.30285C28.9336 9.44935 28.9262 9.5958 28.9103 9.74144H20.6748C20.7626 11.8818 22.155 13.6888 24.4785 13.6888C25.0958 13.7026 25.7079 13.5745 26.2677 13.3144C26.8275 13.0543 27.3199 12.6692 27.7068 12.1888L28.5897 13.0484ZM20.7407 8.59671H27.6146C27.5209 7.7658 27.1244 6.99832 26.5008 6.4403C25.8772 5.88228 25.0699 5.57268 24.2325 5.5704C22.4405 5.5704 21.114 6.8511 20.7187 8.59671H20.7407ZM34.6154 13.7102C33.489 13.6763 32.411 13.246 31.5715 12.4953L30.7721 13.4734C31.849 14.4269 33.2467 14.9391 34.6856 14.9076C36.6095 14.9076 38.1995 13.7585 38.1995 11.8813C38.1995 9.91365 36.3934 9.41171 34.7942 8.96729C33.5238 8.61425 32.3841 8.2975 32.3841 7.31112C32.3841 6.14007 33.5524 5.58744 34.6154 5.58744C35.5255 5.5747 36.4145 5.86138 37.1453 6.40323L37.7998 5.37253C36.8362 4.73552 35.7051 4.3982 34.5495 4.40323C32.8497 4.40323 31.1235 5.50849 31.1235 7.34182C31.1235 9.18672 32.7933 9.63753 34.3433 10.056C35.686 10.4185 36.9389 10.7568 36.9389 11.9558C36.9389 13.0041 35.8759 13.7102 34.6154 13.7102ZM49.8134 13.1576C49.3108 13.7129 48.6967 14.1562 48.011 14.4585C47.3253 14.7608 46.5835 14.9153 45.834 14.912C43.0273 14.912 40.4183 12.8813 40.4183 9.64888C40.4083 8.95941 40.5361 8.27488 40.7942 7.63529C41.0523 6.99571 41.4354 6.4139 41.9212 5.92387C42.407 5.43385 42.9858 5.04544 43.6237 4.78134C44.2616 4.51724 44.9458 4.38276 45.6363 4.38574C46.3514 4.3745 47.0612 4.50869 47.7227 4.78014C48.3842 5.05159 48.9834 5.45461 49.4839 5.96468L48.6714 6.86819C48.2721 6.46445 47.7969 6.14347 47.273 5.92369C46.7492 5.70391 46.187 5.58965 45.6187 5.58749C44.54 5.61076 43.5148 6.06096 42.7685 6.83907C42.0222 7.61718 41.616 8.65945 41.6393 9.7366C41.6626 10.8137 42.1135 11.8375 42.8927 12.5827C43.6719 13.328 44.7157 13.7335 45.7944 13.7103C46.3753 13.7033 46.9484 13.5761 47.4776 13.3368C48.0068 13.0975 48.4806 12.7512 48.869 12.3199L49.8134 13.1576ZM56.7793 5.60932H57.3767L57.5523 4.41196C57.4206 4.39003 56.9769 4.3681 56.8013 4.3681C56.1858 4.35428 55.5759 4.48711 55.0221 4.75559C54.4684 5.02408 53.9866 5.42048 53.6169 5.91195V4.59617H52.3563V14.6839H53.6169V7.83739C53.8676 7.19763 54.301 6.64546 54.8632 6.24939C55.4254 5.85331 56.0916 5.63076 56.7793 5.60932ZM60.8683 19.9821L63.631 13.8681L59.0763 4.61378H60.495L64.2723 12.4295L67.8345 4.61378H69.1829L62.1948 19.9821H60.8683ZM71.3916 4.64917V20H72.6566V13.2851C73.0858 13.8169 73.6321 14.2428 74.2529 14.5296C74.8738 14.8163 75.5525 14.9563 76.2363 14.9386C77.314 14.9468 78.3669 14.6153 79.245 13.9912C79.925 13.5004 80.4753 12.852 80.8487 12.1017C81.2221 11.3515 81.4073 10.5218 81.3884 9.68424C81.3953 8.90106 81.2306 8.12586 80.9058 7.41294C80.5811 6.70001 80.1042 6.0666 79.5085 5.55706C78.5989 4.82871 77.4681 4.43118 76.3022 4.42987C75.6074 4.4217 74.9189 4.56096 74.2821 4.83845C73.6452 5.11594 73.0747 5.52533 72.6083 6.03952V4.64917H71.3916ZM74.1562 13.1046C73.5234 12.7193 73.0044 12.1732 72.6522 11.522V7.6053C73.0443 6.99714 73.5795 6.49409 74.2112 6.1401C74.8428 5.78612 75.5517 5.59197 76.2758 5.57461C77.1634 5.58136 78.022 5.89086 78.7092 6.4518C79.1661 6.84884 79.5298 7.34162 79.7742 7.89502C80.0187 8.44843 80.1379 9.04886 80.1235 9.65354C80.1465 10.1764 80.0637 10.6986 79.8799 11.1888C79.6961 11.6789 79.4152 12.127 79.0539 12.5062C78.6926 12.8854 78.2584 13.1879 77.7773 13.3956C77.2961 13.6033 76.778 13.7119 76.2539 13.7149C75.5128 13.7005 74.7889 13.4899 74.1562 13.1046ZM101.177 14.6839L96.49 4.61378H97.8604L101.572 12.6532L105.288 4.61378H106.658L101.994 14.6839H101.177ZM115.226 14.4418C115.938 14.1208 116.568 13.6446 117.071 13.0484L116.188 12.1888C115.801 12.6692 115.309 13.0543 114.749 13.3144C114.19 13.5745 113.577 13.7026 112.96 13.6888C110.637 13.6888 109.244 11.8818 109.156 9.74144H117.392C117.408 9.5958 117.415 9.44935 117.414 9.30285C117.414 6.49584 115.424 4.37742 112.727 4.37742C109.864 4.37742 107.896 6.75022 107.896 9.64056C107.896 12.7853 110.132 14.9037 112.96 14.9037C113.741 14.9207 114.515 14.7629 115.226 14.4418ZM116.101 8.59671H109.222H109.205C109.6 6.8511 110.927 5.5704 112.719 5.5704C113.556 5.57268 114.363 5.88228 114.987 6.4403C115.61 6.99832 116.007 7.7658 116.101 8.59671ZM120.524 4.50914V4.82493H120.036V6.35124H119.68V4.82493H119.193V4.50914H120.524ZM122.421 4.50914L121.749 5.61001L121.077 4.50914H120.827V6.35124H121.183V5.32493L121.626 6.04861H121.872L122.316 5.32493V6.35124H122.672V4.50914H122.421Z" fill="#6240A3"/></svg>',
        margin: [Spacing.base, Spacing.base, 0, 0],
      };
      expect(header).toEqual(expectedHeader);
    });
  });

  describe('buildPdfServiceHeader', () => {
    const pdfHeaderPropsMock: IPdfServiceHeaderProps = {
      providerName: 'Test Provider',
      providerAddress: {
        address1: '123 E Main St',
        address2: 'Suite 200',
        city: 'Seattle',
        state: 'WA',
        zip: '55555',
      },
      providerCliaNumber: '33D2184654',
    };

    const contentMock: IPdfServiceHeaderContent = {
      cliaLabel: 'clia-label',
      npiLabel: 'npi-label',
      phoneNumberLabel: 'phone-number-label',
      taxIdLabel: 'tax-id-label',
    };

    it('has expected attributes (no tax id, no npi and no phone number when not given)', () => {
      const headerResult = buildPdfServiceHeader(
        pdfHeaderPropsMock,
        contentMock
      );

      const expectedReturn: Content = {
        margin: [-42, 0, 0, 0],
        style: 'tableExample',
        table: {
          widths: [270, '*'],
          body: [
            [
              {
                margin: [40, 0, 0, 0],
                style: 'tableExample',
                table: {
                  heights: [55],
                  widths: ['*'],
                  body: [
                    [
                      {
                        text: pdfHeaderPropsMock.providerName,
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 0],
                        fontSize: 16,
                        alignment: 'left',
                      },
                    ],
                    [
                      {
                        text: '',
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 0],
                        fontSize: 24,
                        alignment: 'left',
                      },
                    ],
                    [
                      {
                        text: '',
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 0],
                        fontSize: 24,
                        alignment: 'left',
                      },
                    ],
                  ],
                },
                layout: {
                  hLineColor: (i: number, node: ContentTable) => {
                    return i === 0 || i === node.table.body.length
                      ? 'gray'
                      : 'gray';
                  },
                  vLineColor: (i: number, node: ContentTable) => {
                    return i === 0 || i === node.table.widths?.length
                      ? 'gray'
                      : 'gray';
                  },
                },
              },
              {
                margin: [0, 0, 0, 0],
                style: 'tableExample',
                table: {
                  widths: ['*'],
                  body: [
                    [
                      {
                        text: `${pdfHeaderPropsMock.providerAddress?.address1}, ${pdfHeaderPropsMock.providerAddress?.city}, ${pdfHeaderPropsMock.providerAddress?.state}, ${pdfHeaderPropsMock.providerAddress?.zip}`,
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 0],
                        fontSize: 9,
                        alignment: 'right',
                        lineHeight: 0.5,
                      },
                    ],
                    [
                      {
                        text: `${contentMock.cliaLabel}: ${pdfHeaderPropsMock.providerCliaNumber}`,
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 0],
                        fontSize: 9,
                        alignment: 'right',
                        lineHeight: 0.5,
                      },
                    ],
                  ],
                },
                layout: {
                  hLineColor: (i: number, node: ContentTable) => {
                    return i === 0 || i === node.table.body.length
                      ? 'gray'
                      : 'gray';
                  },
                  vLineColor: (i: number, node: ContentTable) => {
                    return i === 0 || i === node.table.widths?.length
                      ? 'gray'
                      : 'gray';
                  },
                },
              },
            ],
          ],
        },
        layout: 'noBorders',
      };

      expect(JSON.stringify(headerResult)).toEqual(
        JSON.stringify(expectedReturn)
      );
    });

    it('has expected attributes (tax id, npi and provider phone number when given)', () => {
      const taxIdMock = 'tax-id-mock';
      const npiMock = 'npi-mock';
      const providerPhoneNumberMock = '(206) 555-1212';

      const headerResult = buildPdfServiceHeader(
        {
          ...pdfHeaderPropsMock,
          providerPhoneNumber: providerPhoneNumberMock,
          providerTaxId: taxIdMock,
          npi: npiMock,
        },
        contentMock
      );

      const expectedReturn: Content = {
        margin: [-42, 0, 0, 0],
        style: 'tableExample',
        table: {
          widths: [270, '*'],
          body: [
            [
              {
                margin: [40, 0, 0, 0],
                style: 'tableExample',
                table: {
                  heights: [55],
                  widths: ['*'],
                  body: [
                    [
                      {
                        text: pdfHeaderPropsMock.providerName,
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 0],
                        fontSize: 16,
                        alignment: 'left',
                      },
                    ],
                    [
                      {
                        text: '',
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 0],
                        fontSize: 24,
                        alignment: 'left',
                      },
                    ],
                    [
                      {
                        text: '',
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 0],
                        fontSize: 24,
                        alignment: 'left',
                      },
                    ],
                  ],
                },
                layout: {
                  hLineColor: (i: number, node: ContentTable) => {
                    return i === 0 || i === node.table.body.length
                      ? 'gray'
                      : 'gray';
                  },
                  vLineColor: (i: number, node: ContentTable) => {
                    return i === 0 || i === node.table.widths?.length
                      ? 'gray'
                      : 'gray';
                  },
                },
              },
              {
                margin: [0, 0, 0, 0],
                style: 'tableExample',
                table: {
                  widths: ['*'],
                  body: [
                    [
                      {
                        text: `${pdfHeaderPropsMock.providerAddress?.address1}, ${pdfHeaderPropsMock.providerAddress?.city}, ${pdfHeaderPropsMock.providerAddress?.state}, ${pdfHeaderPropsMock.providerAddress?.zip}`,
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 0],
                        fontSize: 9,
                        alignment: 'right',
                        lineHeight: 0.5,
                      },
                    ],
                    [
                      {
                        text: `${contentMock.phoneNumberLabel}: ${providerPhoneNumberMock}`,
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 0],
                        fontSize: 9,
                        alignment: 'right',
                        lineHeight: 0.5,
                      },
                    ],
                    [
                      {
                        text: `${contentMock.cliaLabel}: ${pdfHeaderPropsMock.providerCliaNumber}`,
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 0],
                        fontSize: 9,
                        alignment: 'right',
                        lineHeight: 0.5,
                      },
                    ],
                    [
                      {
                        text: `${contentMock.taxIdLabel}: ${taxIdMock}`,
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 0],
                        fontSize: 9,
                        alignment: 'right',
                        lineHeight: 0.5,
                      },
                    ],
                    [
                      {
                        text: `${contentMock.npiLabel} ${npiMock}`,
                        border: [false, false, false, false],
                        margin: [0, 0, 0, 0],
                        fontSize: 9,
                        alignment: 'right',
                        lineHeight: 0.5,
                      },
                    ],
                  ],
                },
                layout: {
                  hLineColor: (i: number, node: ContentTable) => {
                    return i === 0 || i === node.table.body.length
                      ? 'gray'
                      : 'gray';
                  },
                  vLineColor: (i: number, node: ContentTable) => {
                    return i === 0 || i === node.table.widths?.length
                      ? 'gray'
                      : 'gray';
                  },
                },
              },
            ],
          ],
        },
        layout: 'noBorders',
      };

      expect(JSON.stringify(headerResult)).toEqual(
        JSON.stringify(expectedReturn)
      );
    });
  });
});
