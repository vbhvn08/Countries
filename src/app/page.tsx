'use client'

import { useCallback, useMemo, useState } from "react";
import useFetch from "@/app/hooks/useFetch";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

import {
  ColDef,
  FirstDataRenderedEvent,
  ICellRendererParams,
  IRowNode,
  RowClickedEvent,
  RowSelectionOptions,
  RowSelectedEvent,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  SizeColumnsToContentStrategy,
  ValueFormatterParams,
} from "ag-grid-community";
import { Country, Currency } from "@/app/types";
import CountryDetails from "@/app/components/CountryDetails";


export default function Home() {
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 50];

  const [selectedCountry, setSelectedCountry] = useState<string>();
  
  const { data, loading, error } = useFetch("https://restcountries.com/v3.1/all?fields=name,cca3,flag,flags,population,currencies,languages");

  const colDefs: ColDef[] = [
    { headerName: 'Flag',
      field: "flags.png",
      cellRenderer: (params: ICellRendererParams) => <img src={params.value} alt="flag" width="30"/>, 
      filter: false,
      sortable: false,
      cellStyle: {display: 'flex', alignItems: 'center '},
    },
    { headerName: 'Name', field: "name.common", filter: true },
    { headerName: 'Population', field: 'population' },
    { headerName: 'Currencies', field: 'currencies', valueFormatter: (params:ValueFormatterParams<Currency, Currency>) => Object.values(params.value || {}).map((c: Currency) => c.name).join(', ') },
    { headerName: 'Languages', field: 'languages', filter: true, valueFormatter: (params: ValueFormatterParams) => Object.values(params.value || {}).join(', ') },
  ];

  const autoSizeStrategy = useMemo<
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy
  >(() => {
    return {
      type: "fitCellContents",
    };
  }, []);

  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {  
      mode: "multiRow",
      headerCheckbox: false
    };
  }, []);

  const onRowSelected = (event: RowSelectedEvent<Country>) => {
    const favoriteCountries = event.api.getSelectedRows().map((country: Country) => country.cca3);
    localStorage.setItem('favoriteCountries', JSON.stringify(favoriteCountries));
  }

  const onRowClicked = (event: RowClickedEvent<Country>) => {
    setSelectedCountry(event?.data?.cca3);
  }

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent<Country>) => {
    const favoriteCountries: string[] = JSON.parse(localStorage.getItem('favoriteCountries')|| '[]'); 
    const nodesToSelect: IRowNode[] = [];
    params.api.forEachNode((node: IRowNode<Country>) => {
        if (node.data && favoriteCountries?.indexOf(node.data.cca3) > -1) {
            nodesToSelect.push(node);
        }
    });
    params.api.setNodesSelected({ nodes: nodesToSelect, newValue: true});
  }, []);

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error?.message}</p>

  return(
    <>
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">Countries</h1>
      <p className="text-sm text-gray-600 text-center mb-6">Check the box to favorite this country!</p>
      
      <div className="flex flex-col items-center">
        <div className="ag-theme-quartz w-full md:w-1/2 h-[519px] mb-4">
          <AgGridReact
            data-testid="ag-grid-react"
            rowData={data}
            columnDefs={colDefs}
            autoSizeStrategy={autoSizeStrategy}
            pagination={true}
            paginationPageSize={paginationPageSize}
            paginationPageSizeSelector={paginationPageSizeSelector}
            rowSelection={rowSelection}
            onRowSelected={onRowSelected}
            onRowClicked={onRowClicked}
            onFirstDataRendered={onFirstDataRendered}
          />
        </div>

        {selectedCountry && (
          <div className="w-full md:w-3/4">
            <CountryDetails countryCode={selectedCountry} />
          </div>
        )}
      </div>
    </>
    )
}
