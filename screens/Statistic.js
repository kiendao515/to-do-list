import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState } from 'react';
import _ from 'lodash';
import { useEffect } from 'react';
const data = require('../results.json');
import { DataTable, TextInput } from 'react-native-paper';
const optionsPerPage = [5, 10];
const Statistic = () => {
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
    const [text, setText] = useState("");
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedData, setSearchedData] = useState([]);
    const [sortFirst, setSortFirst] = useState(true);
    const [sortSecond, setSortSecond] = useState(true);
    const [sortThird, setSortThird] = useState(true);
    const [sortStatus,setSortStatus] = useState(false);
    useEffect(() => {
        setPage(0);
    }, [itemsPerPage, sortFirst, sortSecond, sortThird]);
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    const renderTableData = () => {
        const tableData = (searchQuery!="" || sortStatus == true) ? searchedData : data;
        return tableData.slice(start, end).map((d) => (
            <DataTable.Row key={d.id}>
                <DataTable.Cell>{d.geneName}</DataTable.Cell>
                <DataTable.Cell numeric>{d.mutantGene}</DataTable.Cell>
                <DataTable.Cell numeric>{d.totalGene}</DataTable.Cell>
                <DataTable.Cell numeric>{d.percentTage}</DataTable.Cell>
            </DataTable.Row>
        ));
    };
    const searchGene = async () => {
        const newData = data.filter((d) => {
            const geneName = d.geneName.toLowerCase();
            const query = text.toLowerCase();
            return geneName.includes(query);
        });
        setSearchedData(newData);
        setSearchQuery(text);
    }
    const sortData = async (type, sort) => {
        let sortedData;
        if (type === 1) {
            sortedData = _.orderBy(data, ['mutantGene'], [!sort ? 'asc' : 'desc']);
        } else if (type === 2) {
            sortedData = _.orderBy(data, ['totalGene'], [!sort ? 'asc' : 'desc']);
          } else if (type === 3) {
            sortedData = _.orderBy(data, ['percentTage'], [!sort ? 'asc' : 'desc']);
          }
        setPage(0);
        setSearchedData(sortedData);
        setSortStatus(true);
    }
    return (
        <View style={{ flex: 1, marginTop: 40 }}>
            <View style={{ padding: 10 }}>
                <Text>Tìm kiếm gen</Text>
                <TextInput
                    label="Nhập tên gen"
                    value={text}
                    onChangeText={text => {
                        setText(text);
                        searchGene();
                    }}
                />
            </View>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title >TÊN GEN</DataTable.Title>
                    <DataTable.Title
                        onPress={() => {
                            setSortFirst(!sortFirst);
                            sortData(1,sortFirst);
                        }}
                        sortDirection={sortFirst == true ? 'ascending' : 'descending'}
                        numeric>TỔNG SỐ TRƯỜNG HỢP MANG ĐỘT BIẾN
                    </DataTable.Title>
                    <DataTable.Title
                        onPress={() => {
                            setSortSecond(!sortSecond)
                            sortData(2,sortSecond);
                        }}
                        sortDirection={sortSecond == true ? 'ascending' : 'descending'}
                        numeric>TỔNG SỐ MẪU
                    </DataTable.Title>
                    <DataTable.Title
                        onPress={() =>{
                            setSortThird(!sortThird)
                            sortData(3,sortSecond);
                        }}
                        sortDirection={sortThird == true ? 'ascending' : 'descending'}> TỶ LỆ TRƯỜNG HỢP MANG ĐỘT BIẾN
                    </DataTable.Title>
                </DataTable.Header>
                <ScrollView>
                    {renderTableData()}
                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(data.length / itemsPerPage)}
                        onPageChange={setPage}
                        label={`${start + 1}-${end} of ${data.length}`}
                        showFastPaginationControls
                        numberOfItemsPerPageList={optionsPerPage}
                        numberOfItemsPerPage={itemsPerPage}
                        onItemsPerPageChange={setItemsPerPage}
                        selectPageDropdownLabel={'Rows per page'}
                    />
                </ScrollView>
            </DataTable>
        </View>
    )
}

export default Statistic;