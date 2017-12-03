export const TEST_JSON = {
    budgets: {
        '0': {
            name: '2016-2019',
            positiv: {
                '0': {
                    name: 'Löhne',
                    elements: {
                        '0': {
                            name: 'Company FEMALE',
                            frequency: 1,
                            value: 41600
                        },
                        '1': {
                            name: 'Company MALE',
                            frequency: 1,
                            value: 5200
                        },
                        '2': { name: 'B&A MALE', frequency: 1, value: 23400 },
                        '3': {
                            name: 'Lohn MALE',
                            frequency: 12,
                            value: 1600
                        },
                        length: 4
                    }
                },
                '1': {
                    name: 'Property',
                    elements: {
                        '0': {
                            name: 'House 1',
                            frequency: 1,
                            value: 20000
                        },
                        '1': {
                            name: 'House 2',
                            frequency: 1,
                            value: 20000
                        },
                        '2': {
                            name: 'House 3',
                            frequency: 1,
                            value: 30000
                        },
                        '3': {
                            name: 'House 4',
                            frequency: 1,
                            value: 12000
                        },
                        length: 4
                    }
                },
                '2': {
                    name: 'Renten',
                    elements: {
                        '0': {
                            name: 'Retirement MALE',
                            frequency: 0,
                            value: 1700
                        },
                        '1': {
                            name: 'Retirement FEMALE',
                            frequency: 0,
                            value: 1700
                        },
                        '2': {
                            name: "BVG MALE 300'000.000 6%",
                            frequency: 0,
                            value: 1500
                        },
                        length: 3
                    }
                },
                '3': {
                    name: 'Various',
                    elements: {}
                },
                length: 4
            },
            negativ: {
                '0': {
                    name: 'Living costs',
                    elements: {
                        '0': { name: 'Rent', frequency: 12, value: 1600 },
                        '1': {
                            name: 'Additional costs',
                            frequency: 12,
                            value: 10
                        },
                        '2': { name: 'Electricity', frequency: 1, value: 1200 },
                        '3': {
                            name: 'Tel. Internet, TV , ...',
                            frequency: 1,
                            value: 3000
                        },

                        length: 4
                    }
                },
                '1': {
                    name: 'Apartments',
                    elements: {
                        '0': {
                            name: 'House 5',
                            frequency: 1,
                            value: 1000
                        },
                        '1': {
                            name: 'House 6',
                            frequency: 1,
                            value: 2000
                        },
                        '2': {
                            name: 'House 7',
                            frequency: 1,
                            value: 5000
                        },
                        '3': {
                            name: 'Camper',
                            frequency: 1,
                            value: 2000
                        },
                        '4': { name: 'Various', frequency: 1, value: 100 },

                        length: 5
                    }
                },
                '2': {
                    name: 'Mobilität',
                    elements: {
                        '0': { name: 'Car 1', frequency: 1, value: 3000 },
                        '1': { name: 'Car 2', frequency: 1, value: 3000 },
                        '2': { name: 'Camper', frequency: 1, value: 1000 },
                        '3': { name: 'Diesel', frequency: 12, value: 150 },
                        '4': { name: 'Benzin', frequency: 12, value: 150 },
                        '5': { name: 'Fliegen', frequency: 1, value: 5000 },
                        '6': { name: 'Various', frequency: 1, value: 1000 },

                        length: 7
                    }
                },
                '3': {
                    name: 'Cost of living',
                    elements: {
                        '0': {
                            name: 'Food',
                            frequency: 12,
                            value: 1500
                        },
                        '1': { name: 'Drinks', frequency: 12, value: 200 },
                        '2': {
                            name: 'Körperpflege',
                            frequency: 12,
                            value: 200
                        },
                        '3': { name: 'Clothing', frequency: 12, value: 1000 },
                        '4': {
                            name: 'Anschaffungen',
                            frequency: 12,
                            value: 200
                        },
                        '5': {
                            name: 'Arztkosten + Medi',
                            frequency: 12,
                            value: 200
                        },
                        '6': {
                            name: 'Taschengeld FEMALE',
                            frequency: 12,
                            value: 200
                        },
                        '7': {
                            name: 'Taschengeld MALE',
                            frequency: 12,
                            value: 200
                        },
                        '8': { name: 'Presse', frequency: 12, value: 50 },
                        '9': {
                            name: 'Verbrauchsmaterial, putzen',
                            frequency: 12,
                            value: 100
                        },

                        length: 10
                    }
                },
                '4': {
                    name: 'Insurance',
                    elements: {
                        '0': {
                            name: '3a FEMALE Zürich',
                            frequency: 1,
                            value: 6700
                        },
                        '1': {
                            name: 'Insurance Privat MALE',
                            frequency: 12,
                            value: 600
                        },
                        '2': {
                            name: 'Insurance HP FEMALE',
                            frequency: 12,
                            value: 500
                        },
                        '3': {
                            name: 'Hausrat/Haftpflicht',
                            frequency: 1,
                            value: 1200
                        },
                        '4': {
                            name: '3a MALE',
                            frequency: 1,
                            value: 6700
                        },
                        '5': {
                            name: 'Insurance Camper',
                            frequency: 1,
                            value: 1300
                        },
                        '6': {
                            name: 'Insurance Car 2',
                            frequency: 1,
                            value: 2500
                        },
                        '7': {
                            name: 'Insurance Car 1',
                            frequency: 1,
                            value: 3200
                        },
                        '8': { name: 'Divers', frequency: 1, value: 200 },
                        '9': { name: 'Intertur', frequency: 1, value: 330 },
                        '10': {
                            name: 'Life insurance',
                            frequency: 1,
                            value: 630
                        },
                        '11': {
                            name: 'Life insurance ende 11.03.15',
                            frequency: 0,
                            value: 0
                        },
                        '12': {
                            name: 'Life insurance ?',
                            frequency: 0,
                            value: 3842
                        },
                        '13': {
                            name: 'Life insurance ? Risiko',
                            frequency: 0,
                            value: 572
                        },

                        length: 14
                    }
                },
                '5': {
                    name: 'Support',
                    elements: {
                        '0': { name: 'PARENTS', frequency: 12, value: 2000 },
                        '1': { name: 'Various', frequency: 1, value: 4000 },

                        length: 2
                    }
                },
                '6': {
                    name: 'Hobby',
                    elements: {
                        '0': { name: 'GOFL', frequency: 1, value: 4000 },
                        '1': { name: 'Greenfee', frequency: 1, value: 4000 },
                        '2': { name: 'Wellness', frequency: 1, value: 500 },
                        '3': { name: 'Various', frequency: 1, value: 1000 },
                        '4': { name: 'Gifts', frequency: 1, value: 2000 },
                        '5': { name: 'Club', frequency: 1, value: 700 },
                        '6': { name: 'Club', frequency: 1, value: 500 },

                        length: 7
                    }
                },
                '7': {
                    name: 'Taxes',
                    elements: {
                        '0': { name: 'Car 1', frequency: 1, value: 530 },
                        '1': { name: 'Car 2', frequency: 1, value: 690 },
                        '2': { name: 'Camper', frequency: 1, value: 240 },
                        '3': { name: 'Property', frequency: 1, value: 1000 },
                        '4': {
                            name: 'Location 1',
                            frequency: 1,
                            value: 6000
                        },
                        '5': {
                            name: 'State',
                            frequency: 1,
                            value: 6000
                        },
                        '6': { name: 'Location 2', frequency: 1, value: 3000 },
                        '7': { name: 'Location 3', frequency: 1, value: 3000 },

                        length: 8
                    }
                },
                length: 8
            }
        },
        '1': {
            name: '2020-2025',
            positiv: {
                '0': {
                    name: 'Löhne',
                    elements: {
                        '0': {
                            name: 'Company FEMALE',
                            frequency: 1,
                            value: 41000
                        },
                        '1': {
                            name: 'Company MALE',
                            frequency: 1,
                            value: 4000
                        },
                        '2': { name: 'B&A MALE', frequency: 0, value: 1800 },
                        '3': {
                            name: 'Lohn MALE',
                            frequency: 0,
                            value: 1600
                        },

                        length: 4
                    }
                },
                '1': {
                    name: 'Property',
                    elements: {
                        '0': {
                            name: 'House 1',
                            frequency: 1,
                            value: 20000
                        },
                        '1': {
                            name: 'House 2',
                            frequency: 1,
                            value: 20000
                        },
                        '2': {
                            name: 'House 3',
                            frequency: 1,
                            value: 30000
                        },
                        '3': {
                            name: 'House 4',
                            frequency: 1,
                            value: 12000
                        },

                        length: 4
                    }
                },
                '2': {
                    name: 'Renten',
                    elements: {
                        '0': {
                            name: 'Retirement MALE',
                            frequency: 12,
                            value: 1700
                        },
                        '1': {
                            name: 'Retirement FEMALE',
                            frequency: 0,
                            value: 1700
                        },
                        '2': {
                            name: "BVG MALE 300'000.000 6%",
                            frequency: 12,
                            value: 1500
                        },

                        length: 3
                    }
                },
                '3': {
                    name: 'Various',
                    elements: {}
                },
                length: 4
            },
            negativ: {
                '0': {
                    name: 'Living costs',
                    elements: {
                        '0': { name: 'Rent', frequency: 12, value: 1000 },
                        '1': {
                            name: 'Additional costs',
                            frequency: 12,
                            value: 300
                        },
                        '2': { name: 'Electricity', frequency: 1, value: 1200 },
                        '3': {
                            name: 'Tel. Internet, TV , ...',
                            frequency: 1,
                            value: 3000
                        },

                        length: 4
                    }
                },
                '1': {
                    name: 'Apartments',
                    elements: {
                        '0': {
                            name: 'House 5',
                            frequency: 1,
                            value: 1000
                        },
                        '1': {
                            name: 'House 6',
                            frequency: 1,
                            value: 2000
                        },
                        '2': {
                            name: 'House 7',
                            frequency: 1,
                            value: 5000
                        },
                        '3': {
                            name: 'Camper',
                            frequency: 1,
                            value: 2000
                        },
                        '4': { name: 'Various', frequency: 1, value: 100 },

                        length: 5
                    }
                },
                '2': {
                    name: 'Mobilität',
                    elements: {
                        '0': { name: 'Car 1', frequency: 1, value: 3000 },
                        '1': { name: 'Car 2', frequency: 1, value: 3000 },
                        '2': { name: 'Camper', frequency: 1, value: 1000 },
                        '3': { name: 'Diesel', frequency: 12, value: 150 },
                        '4': { name: 'Benzin', frequency: 12, value: 150 },
                        '5': { name: 'Fliegen', frequency: 1, value: 5000 },
                        '6': { name: 'Various', frequency: 1, value: 1000 },

                        length: 7
                    }
                },
                '3': {
                    name: 'Cost of living',
                    elements: {
                        '0': {
                            name: 'Food',
                            frequency: 12,
                            value: 1500
                        },
                        '1': { name: 'Drinks', frequency: 12, value: 200 },
                        '2': {
                            name: 'Körperpflege',
                            frequency: 12,
                            value: 200
                        },
                        '3': { name: 'Clothing', frequency: 12, value: 1000 },
                        '4': {
                            name: 'Anschaffungen',
                            frequency: 12,
                            value: 200
                        },
                        '5': {
                            name: 'Arztkosten + Medi',
                            frequency: 12,
                            value: 200
                        },
                        '6': {
                            name: 'Taschengeld FEMALE',
                            frequency: 12,
                            value: 200
                        },
                        '7': {
                            name: 'Taschengeld MALE',
                            frequency: 12,
                            value: 200
                        },
                        '8': { name: 'Presse', frequency: 12, value: 50 },
                        '9': {
                            name: 'Verbrauchsmaterial, putzen',
                            frequency: 12,
                            value: 100
                        },

                        length: 10
                    }
                },
                '4': {
                    name: 'Insurance',
                    elements: {
                        '0': {
                            name: '3a FEMALE Zürich',
                            frequency: 1,
                            value: 6700
                        },
                        '1': {
                            name: 'Insurance Privat MALE',
                            frequency: 12,
                            value: 800
                        },
                        '2': {
                            name: 'Insurance HP FEMALE',
                            frequency: 12,
                            value: 700
                        },
                        '3': {
                            name: 'Hausrat/Haftpflicht',
                            frequency: 1,
                            value: 1200
                        },
                        '4': {
                            name: '3a MALE',
                            frequency: 1,
                            value: 0
                        },
                        '5': {
                            name: 'Insurance Camper',
                            frequency: 1,
                            value: 1300
                        },
                        '6': {
                            name: 'Insurance Car 2',
                            frequency: 1,
                            value: 2500
                        },
                        '7': {
                            name: 'Insurance Car 1',
                            frequency: 1,
                            value: 3200
                        },
                        '8': { name: 'Divers', frequency: 1, value: 200 },
                        '9': { name: 'Intertur', frequency: 1, value: 330 },
                        '10': {
                            name: 'Life insurance',
                            frequency: 1,
                            value: 0
                        },
                        '11': {
                            name: 'Life insurance ende 11.03.15',
                            frequency: 0,
                            value: 0
                        },
                        '12': {
                            name: 'Life insurance ?',
                            frequency: 0,
                            value: 3842
                        },
                        '13': {
                            name: 'Life insurance ? Risiko',
                            frequency: 0,
                            value: 572
                        },

                        length: 14
                    }
                },
                '5': {
                    name: 'Support',
                    elements: {
                        '0': { name: 'PARENTS', frequency: 12, value: 0 },
                        '1': { name: 'Various', frequency: 1, value: 2000 },

                        length: 2
                    }
                },
                '6': {
                    name: 'Hobby',
                    elements: {
                        '0': { name: 'GOLF', frequency: 1, value: 4000 },
                        '1': { name: 'Greenfee', frequency: 1, value: 4000 },
                        '2': { name: 'Wellness', frequency: 1, value: 500 },
                        '3': { name: 'Various', frequency: 1, value: 1000 },
                        '4': { name: 'Gifts', frequency: 1, value: 2000 },
                        '5': { name: 'Club', frequency: 1, value: 700 },
                        '6': { name: 'Club', frequency: 1, value: 500 },

                        length: 7
                    }
                },
                '7': {
                    name: 'Taxes',
                    elements: {
                        '0': { name: 'Car 1', frequency: 1, value: 530 },
                        '1': { name: 'Car 2', frequency: 1, value: 690 },
                        '2': { name: 'Camper', frequency: 1, value: 240 },
                        '3': { name: 'Property', frequency: 1, value: 1000 },
                        '4': {
                            name: 'Location 1',
                            frequency: 1,
                            value: 4000
                        },
                        '5': {
                            name: 'State',
                            frequency: 1,
                            value: 4000
                        },
                        '6': { name: 'Location 2', frequency: 1, value: 3000 },
                        '7': { name: 'Location 3', frequency: 1, value: 3000 },

                        length: 8
                    }
                },
                length: 8
            }
        },
        '2': {
            name: '2026-2030',
            positiv: {
                '0': {
                    name: 'Löhne',
                    elements: {
                        '0': {
                            name: 'Company FEMALE',
                            frequency: 0,
                            value: 41000
                        },
                        '1': {
                            name: 'Company MALE',
                            frequency: 1,
                            value: 4000
                        },
                        '2': { name: 'B&A MALE', frequency: 0, value: 1800 },
                        '3': {
                            name: 'Lohn MALE',
                            frequency: 0,
                            value: 1600
                        },

                        length: 4
                    }
                },
                '1': {
                    name: 'Property',
                    elements: {
                        '0': {
                            name: 'House 1',
                            frequency: 0,
                            value: 20000
                        },
                        '1': {
                            name: 'House 2',
                            frequency: 0,
                            value: 20000
                        },
                        '2': {
                            name: 'House 3',
                            frequency: 0,
                            value: 30000
                        },
                        '3': {
                            name: 'House 4',
                            frequency: 0,
                            value: 12000
                        },

                        length: 4
                    }
                },
                '2': {
                    name: 'Renten',
                    elements: {
                        '0': {
                            name: 'Retirement MALE',
                            frequency: 12,
                            value: 1700
                        },
                        '1': {
                            name: 'Retirement FEMALE',
                            frequency: 12,
                            value: 1700
                        },
                        '2': {
                            name: "BVG MALE 300'000.000 6%",
                            frequency: 12,
                            value: 1500
                        },

                        length: 3
                    }
                },
                '3': {
                    name: 'Various',
                    elements: {}
                },
                length: 4
            },
            negativ: {
                '0': {
                    name: 'Living costs',
                    elements: {
                        '0': { name: 'Rent', frequency: 12, value: 1000 },
                        '1': {
                            name: 'Additional costs',
                            frequency: 12,
                            value: 300
                        },
                        '2': { name: 'Electricity', frequency: 1, value: 1200 },
                        '3': {
                            name: 'Tel. Internet, TV , ...',
                            frequency: 1,
                            value: 3000
                        },

                        length: 4
                    }
                },
                '1': {
                    name: 'Apartments',
                    elements: {
                        '0': {
                            name: 'House 5',
                            frequency: 0,
                            value: 1000
                        },
                        '1': {
                            name: 'House 6',
                            frequency: 0,
                            value: 2000
                        },
                        '2': {
                            name: 'House 7',
                            frequency: 0,
                            value: 5000
                        },
                        '3': {
                            name: 'Camper',
                            frequency: 1,
                            value: 2000
                        },
                        '4': { name: 'Various', frequency: 1, value: 100 },

                        length: 5
                    }
                },
                '2': {
                    name: 'Mobilität',
                    elements: {
                        '0': { name: 'Car 1', frequency: 1, value: 3000 },
                        '1': { name: 'Car 2', frequency: 1, value: 3000 },
                        '2': { name: 'Camper', frequency: 1, value: 1000 },
                        '3': { name: 'Diesel', frequency: 12, value: 150 },
                        '4': { name: 'Benzin', frequency: 12, value: 150 },
                        '5': { name: 'Fliegen', frequency: 1, value: 5000 },
                        '6': { name: 'Various', frequency: 1, value: 1000 },

                        length: 7
                    }
                },
                '3': {
                    name: 'Cost of living',
                    elements: {
                        '0': {
                            name: 'Food',
                            frequency: 12,
                            value: 1500
                        },
                        '1': { name: 'Drinks', frequency: 12, value: 200 },
                        '2': {
                            name: 'Körperpflege',
                            frequency: 12,
                            value: 200
                        },
                        '3': { name: 'Clothing', frequency: 12, value: 1000 },
                        '4': {
                            name: 'Anschaffungen',
                            frequency: 12,
                            value: 200
                        },
                        '5': {
                            name: 'Arztkosten + Medi',
                            frequency: 12,
                            value: 200
                        },
                        '6': {
                            name: 'Taschengeld FEMALE',
                            frequency: 12,
                            value: 200
                        },
                        '7': {
                            name: 'Taschengeld MALE',
                            frequency: 12,
                            value: 200
                        },
                        '8': { name: 'Presse', frequency: 12, value: 50 },
                        '9': {
                            name: 'Verbrauchsmaterial, putzen',
                            frequency: 12,
                            value: 100
                        },

                        length: 10
                    }
                },
                '4': {
                    name: 'Insurance',
                    elements: {
                        '0': {
                            name: '3a FEMALE Zürich',
                            frequency: 0,
                            value: 6700
                        },
                        '1': {
                            name: 'Insurance Privat MALE',
                            frequency: 12,
                            value: 1000
                        },
                        '2': {
                            name: 'Insurance HP FEMALE',
                            frequency: 12,
                            value: 850
                        },
                        '3': {
                            name: 'Hausrat/Haftpflicht',
                            frequency: 1,
                            value: 1300
                        },
                        '4': {
                            name: '3a MALE',
                            frequency: 0,
                            value: 6700
                        },
                        '5': {
                            name: 'Insurance Camper',
                            frequency: 1,
                            value: 1300
                        },
                        '6': {
                            name: 'Insurance Car 2',
                            frequency: 1,
                            value: 2500
                        },
                        '7': {
                            name: 'Insurance Car 1',
                            frequency: 1,
                            value: 3200
                        },
                        '8': { name: 'Divers', frequency: 1, value: 200 },
                        '9': { name: 'Intertur', frequency: 1, value: 330 },
                        '10': {
                            name: 'Life insurance',
                            frequency: 1,
                            value: 0
                        },
                        '11': {
                            name: 'Life insurance ende 11.03.15',
                            frequency: 0,
                            value: 0
                        },
                        '12': {
                            name: 'Life insurance ?',
                            frequency: 0,
                            value: 3842
                        },
                        '13': {
                            name: 'Life insurance ? Risiko',
                            frequency: 0,
                            value: 572
                        },

                        length: 14
                    }
                },
                '5': {
                    name: 'Support',
                    elements: {
                        '0': { name: 'PARENTS', frequency: 0, value: 24000 },
                        '1': { name: 'Various', frequency: 0, value: 2000 },

                        length: 2
                    }
                },
                '6': {
                    name: 'Hobby',
                    elements: {
                        '0': { name: 'GOLF', frequency: 1, value: 4000 },
                        '1': { name: 'Greenfee', frequency: 1, value: 4000 },
                        '2': { name: 'Wellness', frequency: 1, value: 500 },
                        '3': { name: 'Various', frequency: 1, value: 1000 },
                        '4': { name: 'Gifts', frequency: 1, value: 2000 },
                        '5': { name: 'Club', frequency: 1, value: 700 },
                        '6': { name: 'Club', frequency: 1, value: 500 },

                        length: 7
                    }
                },
                '7': {
                    name: 'Taxes',
                    elements: {
                        '0': { name: 'Car 1', frequency: 1, value: 530 },
                        '1': { name: 'Car 2', frequency: 1, value: 690 },
                        '2': { name: 'Camper', frequency: 1, value: 240 },
                        '3': { name: 'Property', frequency: 1, value: 1000 },
                        '4': {
                            name: 'Location 1',
                            frequency: 1,
                            value: 3000
                        },
                        '5': {
                            name: 'State',
                            frequency: 1,
                            value: 3000
                        },
                        '6': { name: 'Location 2', frequency: 0, value: 3000 },
                        '7': { name: 'Location 3', frequency: 0, value: 3000 },

                        length: 8
                    }
                },
                length: 8
            }
        },
        '3': {
            name: '2031-2035',
            positiv: {
                '0': {
                    name: 'Löhne',
                    elements: {
                        '0': {
                            name: 'Company FEMALE',
                            frequency: 0,
                            value: 41000
                        },
                        '1': {
                            name: 'Company MALE',
                            frequency: 0,
                            value: 4000
                        },
                        '2': { name: 'B&A MALE', frequency: 0, value: 1800 },
                        '3': {
                            name: 'Lohn MALE',
                            frequency: 0,
                            value: 1600
                        },

                        length: 4
                    }
                },
                '1': {
                    name: 'Property',
                    elements: {
                        '0': {
                            name: 'House 1',
                            frequency: 0,
                            value: 20000
                        },
                        '1': {
                            name: 'House 2',
                            frequency: 0,
                            value: 20000
                        },
                        '2': {
                            name: 'House 3',
                            frequency: 0,
                            value: 30000
                        },
                        '3': {
                            name: 'House 4',
                            frequency: 0,
                            value: 12000
                        },

                        length: 4
                    }
                },
                '2': {
                    name: 'Renten',
                    elements: {
                        '0': {
                            name: 'Retirement MALE',
                            frequency: 12,
                            value: 1700
                        },
                        '1': {
                            name: 'Retirement FEMALE',
                            frequency: 12,
                            value: 1700
                        },
                        '2': {
                            name: "BVG MALE 300'000.000 6%",
                            frequency: 12,
                            value: 1500
                        },

                        length: 3
                    }
                },
                '3': {
                    name: 'Various',
                    elements: {}
                },
                length: 4
            },
            negativ: {
                '0': {
                    name: 'Living costs',
                    elements: {
                        '0': { name: 'Rent', frequency: 0, value: 1000 },
                        '1': {
                            name: 'Additional costs',
                            frequency: 12,
                            value: 300
                        },
                        '2': { name: 'Electricity', frequency: 1, value: 1200 },
                        '3': {
                            name: 'Tel. Internet, TV , ...',
                            frequency: 1,
                            value: 3000
                        },

                        length: 4
                    }
                },
                '1': {
                    name: 'Apartments',
                    elements: {
                        '0': {
                            name: 'House 5',
                            frequency: 0,
                            value: 1000
                        },
                        '1': {
                            name: 'House 6',
                            frequency: 0,
                            value: 2000
                        },
                        '2': {
                            name: 'House 7',
                            frequency: 0,
                            value: 5000
                        },
                        '3': {
                            name: 'Camper',
                            frequency: 1,
                            value: 2000
                        },
                        '4': { name: 'Various', frequency: 1, value: 100 },

                        length: 5
                    }
                },
                '2': {
                    name: 'Mobilität',
                    elements: {
                        '0': { name: 'Car 1', frequency: 1, value: 3000 },
                        '1': { name: 'Car 2', frequency: 1, value: 3000 },
                        '2': { name: 'Camper', frequency: 1, value: 1000 },
                        '3': { name: 'Diesel', frequency: 12, value: 100 },
                        '4': { name: 'Benzin', frequency: 12, value: 100 },
                        '5': { name: 'Fliegen', frequency: 1, value: 5000 },
                        '6': { name: 'Various', frequency: 1, value: 1000 },

                        length: 7
                    }
                },
                '3': {
                    name: 'Cost of living',
                    elements: {
                        '0': {
                            name: 'Food',
                            frequency: 12,
                            value: 1500
                        },
                        '1': { name: 'Drinks', frequency: 12, value: 200 },
                        '2': {
                            name: 'Körperpflege',
                            frequency: 12,
                            value: 200
                        },
                        '3': { name: 'Clothing', frequency: 12, value: 1000 },
                        '4': {
                            name: 'Anschaffungen',
                            frequency: 12,
                            value: 200
                        },
                        '5': {
                            name: 'Arztkosten + Medi',
                            frequency: 12,
                            value: 200
                        },
                        '6': {
                            name: 'Taschengeld FEMALE',
                            frequency: 12,
                            value: 200
                        },
                        '7': {
                            name: 'Taschengeld MALE',
                            frequency: 12,
                            value: 200
                        },
                        '8': { name: 'Presse', frequency: 12, value: 50 },
                        '9': {
                            name: 'Verbrauchsmaterial, putzen',
                            frequency: 12,
                            value: 100
                        },

                        length: 10
                    }
                },
                '4': {
                    name: 'Insurance',
                    elements: {
                        '0': {
                            name: '3a FEMALE Zürich',
                            frequency: 0,
                            value: 6700
                        },
                        '1': {
                            name: 'Insurance Privat MALE',
                            frequency: 12,
                            value: 1000
                        },
                        '2': {
                            name: 'Insurance HP FEMALE',
                            frequency: 12,
                            value: 850
                        },
                        '3': {
                            name: 'Hausrat/Haftpflicht',
                            frequency: 1,
                            value: 1500
                        },
                        '4': {
                            name: '3a MALE',
                            frequency: 0,
                            value: 6700
                        },
                        '5': {
                            name: 'Insurance Camper',
                            frequency: 1,
                            value: 1300
                        },
                        '6': {
                            name: 'Insurance Car 2',
                            frequency: 0,
                            value: 2500
                        },
                        '7': {
                            name: 'Insurance Car 1',
                            frequency: 1,
                            value: 3200
                        },
                        '8': { name: 'Divers', frequency: 1, value: 200 },
                        '9': { name: 'Intertur', frequency: 1, value: 330 },
                        '10': {
                            name: 'Life insurance',
                            frequency: 1,
                            value: 0
                        },
                        '11': {
                            name: 'Life insurance ende 11.03.15',
                            frequency: 0,
                            value: 0
                        },
                        '12': {
                            name: 'Life insurance ?',
                            frequency: 0,
                            value: 3842
                        },
                        '13': {
                            name: 'Life insurance ? Risiko',
                            frequency: 0,
                            value: 572
                        },

                        length: 14
                    }
                },
                '5': {
                    name: 'Support',
                    elements: {
                        '0': { name: 'PARENTS', frequency: 0, value: 24000 },
                        '1': { name: 'Various', frequency: 0, value: 2000 },

                        length: 2
                    }
                },
                '6': {
                    name: 'Hobby',
                    elements: {
                        '0': { name: 'GOLF', frequency: 1, value: 4000 },
                        '1': { name: 'Greenfee', frequency: 1, value: 3000 },
                        '2': { name: 'Wellness', frequency: 1, value: 500 },
                        '3': { name: 'Various', frequency: 1, value: 500 },
                        '4': { name: 'Gifts', frequency: 1, value: 1000 },
                        '5': { name: 'Club', frequency: 1, value: 700 },
                        '6': { name: 'Club', frequency: 1, value: 500 },

                        length: 7
                    }
                },
                '7': {
                    name: 'Taxes',
                    elements: {
                        '0': { name: 'Car 1', frequency: 1, value: 530 },
                        '1': { name: 'Car 2', frequency: 1, value: 690 },
                        '2': { name: 'Camper', frequency: 1, value: 240 },
                        '3': { name: 'Property', frequency: 0, value: 1000 },
                        '4': {
                            name: 'Location 1',
                            frequency: 1,
                            value: 3000
                        },
                        '5': {
                            name: 'State',
                            frequency: 1,
                            value: 3000
                        },
                        '6': { name: 'Location 2', frequency: 0, value: 3000 },
                        '7': { name: 'Location 3', frequency: 0, value: 3000 },

                        length: 8
                    }
                },
                length: 8
            }
        },
        '4': {
            name: '2036-2040',
            positiv: {
                '0': {
                    name: 'Löhne',
                    elements: {
                        '0': {
                            name: 'Company FEMALE',
                            frequency: 0,
                            value: 41000
                        },
                        '1': {
                            name: 'Company MALE',
                            frequency: 0,
                            value: 4000
                        },
                        '2': { name: 'B&A MALE', frequency: 0, value: 1800 },
                        '3': {
                            name: 'Lohn MALE',
                            frequency: 0,
                            value: 1600
                        },

                        length: 4
                    }
                },
                '1': {
                    name: 'Property',
                    elements: {
                        '0': {
                            name: 'House 1',
                            frequency: 0,
                            value: 20000
                        },
                        '1': {
                            name: 'House 2',
                            frequency: 0,
                            value: 20000
                        },
                        '2': {
                            name: 'House 3',
                            frequency: 0,
                            value: 30000
                        },
                        '3': {
                            name: 'House 4',
                            frequency: 0,
                            value: 12000
                        },

                        length: 4
                    }
                },
                '2': {
                    name: 'Renten',
                    elements: {
                        '0': {
                            name: 'Retirement MALE',
                            frequency: 12,
                            value: 1700
                        },
                        '1': {
                            name: 'Retirement FEMALE',
                            frequency: 12,
                            value: 1700
                        },
                        '2': {
                            name: "BVG MALE 300'000.000 6%",
                            frequency: 12,
                            value: 1500
                        },

                        length: 3
                    }
                },
                '3': {
                    name: 'Various',
                    elements: {}
                },
                length: 4
            },
            negativ: {
                '0': {
                    name: 'Living costs',
                    elements: {
                        '0': { name: 'Rent', frequency: 0, value: 1000 },
                        '1': {
                            name: 'Additional costs',
                            frequency: 12,
                            value: 300
                        },
                        '2': { name: 'Electricity', frequency: 1, value: 1200 },
                        '3': {
                            name: 'Tel. Internet, TV , ...',
                            frequency: 1,
                            value: 3000
                        },

                        length: 4
                    }
                },
                '1': {
                    name: 'Apartments',
                    elements: {
                        '0': {
                            name: 'House 5',
                            frequency: 0,
                            value: 1000
                        },
                        '1': {
                            name: 'House 6',
                            frequency: 0,
                            value: 2000
                        },
                        '2': {
                            name: 'House 7',
                            frequency: 0,
                            value: 5000
                        },
                        '3': {
                            name: 'Camper',
                            frequency: 1,
                            value: 2000
                        },
                        '4': { name: 'Various', frequency: 1, value: 100 },

                        length: 5
                    }
                },
                '2': {
                    name: 'Mobilität',
                    elements: {
                        '0': { name: 'Car 1', frequency: 1, value: 3000 },
                        '1': { name: 'Car 2', frequency: 1, value: 3000 },
                        '2': { name: 'Camper', frequency: 1, value: 1000 },
                        '3': { name: 'Diesel', frequency: 12, value: 100 },
                        '4': { name: 'Benzin', frequency: 12, value: 100 },
                        '5': { name: 'Fliegen', frequency: 0, value: 5000 },
                        '6': { name: 'Various', frequency: 1, value: 1000 },

                        length: 7
                    }
                },
                '3': {
                    name: 'Cost of living',
                    elements: {
                        '0': {
                            name: 'Food',
                            frequency: 12,
                            value: 1500
                        },
                        '1': { name: 'Drinks', frequency: 12, value: 200 },
                        '2': {
                            name: 'Körperpflege',
                            frequency: 12,
                            value: 200
                        },
                        '3': { name: 'Clothing', frequency: 12, value: 1000 },
                        '4': {
                            name: 'Anschaffungen',
                            frequency: 12,
                            value: 200
                        },
                        '5': {
                            name: 'Arztkosten + Medi',
                            frequency: 12,
                            value: 200
                        },
                        '6': {
                            name: 'Taschengeld FEMALE',
                            frequency: 12,
                            value: 200
                        },
                        '7': {
                            name: 'Taschengeld MALE',
                            frequency: 12,
                            value: 200
                        },
                        '8': { name: 'Presse', frequency: 12, value: 50 },
                        '9': {
                            name: 'Verbrauchsmaterial, putzen',
                            frequency: 12,
                            value: 100
                        },

                        length: 10
                    }
                },
                '4': {
                    name: 'Insurance',
                    elements: {
                        '0': {
                            name: '3a FEMALE Zürich',
                            frequency: 0,
                            value: 6700
                        },
                        '1': {
                            name: 'Insurance Privat MALE',
                            frequency: 12,
                            value: 1000
                        },
                        '2': {
                            name: 'Insurance HP FEMALE',
                            frequency: 12,
                            value: 850
                        },
                        '3': {
                            name: 'Hausrat/Haftpflicht',
                            frequency: 1,
                            value: 1500
                        },
                        '4': {
                            name: '3a MALE',
                            frequency: 0,
                            value: 6700
                        },
                        '5': {
                            name: 'Insurance Camper',
                            frequency: 1,
                            value: 1300
                        },
                        '6': {
                            name: 'Insurance Car 2',
                            frequency: 1,
                            value: 2500
                        },
                        '7': {
                            name: 'Insurance Car 1',
                            frequency: 1,
                            value: 3200
                        },
                        '8': { name: 'Divers', frequency: 1, value: 200 },
                        '9': { name: 'Intertur', frequency: 1, value: 330 },
                        '10': {
                            name: 'Life insurance',
                            frequency: 1,
                            value: 0
                        },
                        '11': {
                            name: 'Life insurance ende 11.03.15',
                            frequency: 0,
                            value: 0
                        },
                        '12': {
                            name: 'Life insurance ?',
                            frequency: 0,
                            value: 3842
                        },
                        '13': {
                            name: 'Life insurance ? Risiko',
                            frequency: 0,
                            value: 572
                        },

                        length: 14
                    }
                },
                '5': {
                    name: 'Support',
                    elements: {
                        '0': { name: 'PARENTS', frequency: 0, value: 24000 },
                        '1': { name: 'Various', frequency: 0, value: 2000 },

                        length: 2
                    }
                },
                '6': {
                    name: 'Hobby',
                    elements: {
                        '0': { name: 'GOLF', frequency: 1, value: 4000 },
                        '1': { name: 'Greenfee', frequency: 1, value: 3000 },
                        '2': { name: 'Wellness', frequency: 1, value: 500 },
                        '3': { name: 'Various', frequency: 1, value: 500 },
                        '4': { name: 'Gifts', frequency: 1, value: 1000 },
                        '5': { name: 'Club', frequency: 1, value: 700 },
                        '6': { name: 'Club', frequency: 1, value: 500 },

                        length: 7
                    }
                },
                '7': {
                    name: 'Taxes',
                    elements: {
                        '0': { name: 'Car 1', frequency: 1, value: 530 },
                        '1': { name: 'Car 2', frequency: 1, value: 690 },
                        '2': { name: 'Camper', frequency: 1, value: 240 },
                        '3': { name: 'Property', frequency: 0, value: 1000 },
                        '4': {
                            name: 'Location 1',
                            frequency: 1,
                            value: 3000
                        },
                        '5': {
                            name: 'State',
                            frequency: 1,
                            value: 3000
                        },
                        '6': { name: 'Location 2', frequency: 0, value: 3000 },
                        '7': { name: 'Location 3', frequency: 0, value: 3000 },

                        length: 8
                    }
                },
                length: 8
            }
        },
        '5': {
            name: '2041-2045',
            positiv: {
                '0': {
                    name: 'Löhne',
                    elements: {
                        '0': {
                            name: 'Company FEMALE',
                            frequency: 0,
                            value: 41000
                        },
                        '1': {
                            name: 'Company MALE',
                            frequency: 0,
                            value: 4000
                        },
                        '2': { name: 'B&A MALE', frequency: 0, value: 1800 },
                        '3': {
                            name: 'Lohn MALE',
                            frequency: 0,
                            value: 1600
                        },

                        length: 4
                    }
                },
                '1': {
                    name: 'Property',
                    elements: {
                        '0': {
                            name: 'House 1',
                            frequency: 0,
                            value: 20000
                        },
                        '1': {
                            name: 'House 2',
                            frequency: 0,
                            value: 20000
                        },
                        '2': {
                            name: 'House 3',
                            frequency: 0,
                            value: 30000
                        },
                        '3': {
                            name: 'House 4',
                            frequency: 0,
                            value: 12000
                        },

                        length: 4
                    }
                },
                '2': {
                    name: 'Renten',
                    elements: {
                        '0': {
                            name: 'Retirement MALE',
                            frequency: 12,
                            value: 1700
                        },
                        '1': {
                            name: 'Retirement FEMALE',
                            frequency: 12,
                            value: 1700
                        },
                        '2': {
                            name: "BVG MALE 300'000.000 6%",
                            frequency: 12,
                            value: 1500
                        },

                        length: 3
                    }
                },
                '3': {
                    name: 'Various',
                    elements: {}
                },
                length: 4
            },
            negativ: {
                '0': {
                    name: 'Living costs',
                    elements: {
                        '0': { name: 'Rent', frequency: 0, value: 1000 },
                        '1': {
                            name: 'Additional costs',
                            frequency: 12,
                            value: 300
                        },
                        '2': { name: 'Electricity', frequency: 1, value: 1200 },
                        '3': {
                            name: 'Tel. Internet, TV , ...',
                            frequency: 1,
                            value: 3000
                        },

                        length: 4
                    }
                },
                '1': {
                    name: 'Apartments',
                    elements: {
                        '0': {
                            name: 'House 5',
                            frequency: 0,
                            value: 1000
                        },
                        '1': {
                            name: 'House 6',
                            frequency: 0,
                            value: 2000
                        },
                        '2': {
                            name: 'House 7',
                            frequency: 0,
                            value: 5000
                        },
                        '3': {
                            name: 'Camper',
                            frequency: 1,
                            value: 2000
                        },
                        '4': { name: 'Various', frequency: 1, value: 100 },

                        length: 5
                    }
                },
                '2': {
                    name: 'Mobilität',
                    elements: {
                        '0': { name: 'Car 1', frequency: 1, value: 3000 },
                        '1': { name: 'Car 2', frequency: 0, value: 3000 },
                        '2': { name: 'Camper', frequency: 1, value: 1000 },
                        '3': { name: 'Diesel', frequency: 12, value: 100 },
                        '4': { name: 'Benzin', frequency: 0, value: 100 },
                        '5': { name: 'Fliegen', frequency: 1, value: 5000 },
                        '6': { name: 'Various', frequency: 1, value: 1000 },

                        length: 7
                    }
                },
                '3': {
                    name: 'Cost of living',
                    elements: {
                        '0': {
                            name: 'Food',
                            frequency: 12,
                            value: 1500
                        },
                        '1': { name: 'Drinks', frequency: 12, value: 200 },
                        '2': {
                            name: 'Körperpflege',
                            frequency: 12,
                            value: 200
                        },
                        '3': { name: 'Clothing', frequency: 12, value: 1000 },
                        '4': {
                            name: 'Anschaffungen',
                            frequency: 12,
                            value: 200
                        },
                        '5': {
                            name: 'Arztkosten + Medi',
                            frequency: 12,
                            value: 400
                        },
                        '6': {
                            name: 'Taschengeld FEMALE',
                            frequency: 12,
                            value: 200
                        },
                        '7': {
                            name: 'Taschengeld MALE',
                            frequency: 12,
                            value: 200
                        },
                        '8': { name: 'Presse', frequency: 12, value: 50 },
                        '9': {
                            name: 'Verbrauchsmaterial, putzen',
                            frequency: 12,
                            value: 100
                        },

                        length: 10
                    }
                },
                '4': {
                    name: 'Insurance',
                    elements: {
                        '0': {
                            name: '3a FEMALE Zürich',
                            frequency: 0,
                            value: 6700
                        },
                        '1': {
                            name: 'Insurance Privat MALE',
                            frequency: 12,
                            value: 1200
                        },
                        '2': {
                            name: 'Insurance HP FEMALE',
                            frequency: 12,
                            value: 1000
                        },
                        '3': {
                            name: 'Hausrat/Haftpflicht',
                            frequency: 1,
                            value: 1500
                        },
                        '4': {
                            name: '3a MALE',
                            frequency: 0,
                            value: 6700
                        },
                        '5': {
                            name: 'Insurance Camper',
                            frequency: 1,
                            value: 1300
                        },
                        '6': {
                            name: 'Insurance Car 2',
                            frequency: 0,
                            value: 2500
                        },
                        '7': {
                            name: 'Insurance Car 1',
                            frequency: 1,
                            value: 3200
                        },
                        '8': { name: 'Divers', frequency: 1, value: 200 },
                        '9': { name: 'Intertur', frequency: 1, value: 330 },
                        '10': {
                            name: 'Life insurance',
                            frequency: 1,
                            value: 0
                        },
                        '11': {
                            name: 'Life insurance ende 11.03.15',
                            frequency: 0,
                            value: 0
                        },
                        '12': {
                            name: 'Life insurance ?',
                            frequency: 0,
                            value: 3842
                        },
                        '13': {
                            name: 'Life insurance ? Risiko',
                            frequency: 0,
                            value: 572
                        },

                        length: 14
                    }
                },
                '5': {
                    name: 'Support',
                    elements: {
                        '0': { name: 'PARENTS', frequency: 0, value: 24000 },
                        '1': { name: 'Various', frequency: 0, value: 2000 },

                        length: 2
                    }
                },
                '6': {
                    name: 'Hobby',
                    elements: {
                        '0': { name: 'GOLF', frequency: 1, value: 4000 },
                        '1': { name: 'Greenfee', frequency: 1, value: 2000 },
                        '2': { name: 'Wellness', frequency: 1, value: 500 },
                        '3': { name: 'Various', frequency: 1, value: 500 },
                        '4': { name: 'Gifts', frequency: 1, value: 500 },
                        '5': { name: 'Club', frequency: 1, value: 700 },
                        '6': { name: 'Club', frequency: 1, value: 500 },

                        length: 7
                    }
                },
                '7': {
                    name: 'Taxes',
                    elements: {
                        '0': { name: 'Car 1', frequency: 0, value: 530 },
                        '1': { name: 'Car 2', frequency: 1, value: 690 },
                        '2': { name: 'Camper', frequency: 1, value: 240 },
                        '3': { name: 'Property', frequency: 0, value: 1000 },
                        '4': {
                            name: 'Location 1',
                            frequency: 1,
                            value: 3000
                        },
                        '5': {
                            name: 'State',
                            frequency: 1,
                            value: 3000
                        },
                        '6': { name: 'Location 2', frequency: 0, value: 3000 },
                        '7': { name: 'Location 3', frequency: 0, value: 3000 },

                        length: 8
                    }
                },
                length: 8
            }
        },
        '6': {
            name: '2046-2050',
            positiv: {
                '0': {
                    name: 'Löhne',
                    elements: {
                        '0': {
                            name: 'Company FEMALE',
                            frequency: 0,
                            value: 41000
                        },
                        '1': {
                            name: 'Company MALE',
                            frequency: 0,
                            value: 4000
                        },
                        '2': { name: 'B&A MALE', frequency: 0, value: 1800 },
                        '3': {
                            name: 'Lohn MALE',
                            frequency: 0,
                            value: 1600
                        },

                        length: 4
                    }
                },
                '1': {
                    name: 'Property',
                    elements: {
                        '0': {
                            name: 'House 1',
                            frequency: 0,
                            value: 20000
                        },
                        '1': {
                            name: 'House 2',
                            frequency: 0,
                            value: 20000
                        },
                        '2': {
                            name: 'House 3',
                            frequency: 0,
                            value: 30000
                        },
                        '3': {
                            name: 'House 4',
                            frequency: 0,
                            value: 12000
                        },

                        length: 4
                    }
                },
                '2': {
                    name: 'Renten',
                    elements: {
                        '0': {
                            name: 'Retirement MALE',
                            frequency: 12,
                            value: 1700
                        },
                        '1': {
                            name: 'Retirement FEMALE',
                            frequency: 12,
                            value: 1700
                        },
                        '2': {
                            name: "BVG MALE 300'000.000 6%",
                            frequency: 12,
                            value: 1500
                        },

                        length: 3
                    }
                },
                '3': {
                    name: 'Various',
                    elements: {}
                },
                length: 4
            },
            negativ: {
                '0': {
                    name: 'Living costs',
                    elements: {
                        '0': { name: 'Rent', frequency: 0, value: 1000 },
                        '1': {
                            name: 'Additional costs',
                            frequency: 12,
                            value: 300
                        },
                        '2': { name: 'Electricity', frequency: 1, value: 1200 },
                        '3': {
                            name: 'Tel. Internet, TV , ...',
                            frequency: 1,
                            value: 3000
                        },

                        length: 4
                    }
                },
                '1': {
                    name: 'Apartments',
                    elements: {
                        '0': {
                            name: 'House 5',
                            frequency: 0,
                            value: 1000
                        },
                        '1': {
                            name: 'House 6',
                            frequency: 0,
                            value: 2000
                        },
                        '2': {
                            name: 'House 7',
                            frequency: 0,
                            value: 5000
                        },
                        '3': {
                            name: 'Camper',
                            frequency: 1,
                            value: 2000
                        },
                        '4': { name: 'Various', frequency: 0, value: 100 },

                        length: 5
                    }
                },
                '2': {
                    name: 'Mobilität',
                    elements: {
                        '0': { name: 'Car 1', frequency: 0, value: 3000 },
                        '1': { name: 'Car 2', frequency: 0, value: 3000 },
                        '2': { name: 'Camper', frequency: 0, value: 1000 },
                        '3': { name: 'Diesel', frequency: 0, value: 100 },
                        '4': { name: 'Benzin', frequency: 0, value: 100 },
                        '5': { name: 'Fliegen', frequency: 1, value: 2000 },
                        '6': { name: 'Various', frequency: 1, value: 3000 },

                        length: 7
                    }
                },
                '3': {
                    name: 'Cost of living',
                    elements: {
                        '0': {
                            name: 'Food',
                            frequency: 12,
                            value: 1500
                        },
                        '1': { name: 'Drinks', frequency: 12, value: 200 },
                        '2': {
                            name: 'Körperpflege',
                            frequency: 12,
                            value: 200
                        },
                        '3': { name: 'Clothing', frequency: 12, value: 1000 },
                        '4': {
                            name: 'Anschaffungen',
                            frequency: 12,
                            value: 200
                        },
                        '5': {
                            name: 'Arztkosten + Medi',
                            frequency: 12,
                            value: 400
                        },
                        '6': {
                            name: 'Taschengeld FEMALE',
                            frequency: 12,
                            value: 200
                        },
                        '7': {
                            name: 'Taschengeld MALE',
                            frequency: 12,
                            value: 200
                        },
                        '8': { name: 'Presse', frequency: 12, value: 50 },
                        '9': {
                            name: 'Verbrauchsmaterial, putzen',
                            frequency: 12,
                            value: 100
                        },

                        length: 10
                    }
                },
                '4': {
                    name: 'Insurance',
                    elements: {
                        '0': {
                            name: '3a FEMALE Zürich',
                            frequency: 0,
                            value: 6700
                        },
                        '1': {
                            name: 'Insurance Privat MALE',
                            frequency: 12,
                            value: 1200
                        },
                        '2': {
                            name: 'Insurance HP FEMALE',
                            frequency: 12,
                            value: 1000
                        },
                        '3': {
                            name: 'Hausrat/Haftpflicht',
                            frequency: 1,
                            value: 1500
                        },
                        '4': {
                            name: '3a MALE',
                            frequency: 0,
                            value: 6700
                        },
                        '5': {
                            name: 'Insurance Camper',
                            frequency: 0,
                            value: 1300
                        },
                        '6': {
                            name: 'Insurance Car 2',
                            frequency: 0,
                            value: 2500
                        },
                        '7': {
                            name: 'Insurance Car 1',
                            frequency: 0,
                            value: 3200
                        },
                        '8': { name: 'Divers', frequency: 1, value: 200 },
                        '9': { name: 'Intertur', frequency: 1, value: 330 },
                        '10': {
                            name: 'Life insurance',
                            frequency: 1,
                            value: 0
                        },
                        '11': {
                            name: 'Life insurance ende 11.03.15',
                            frequency: 0,
                            value: 0
                        },
                        '12': {
                            name: 'Life insurance ?',
                            frequency: 0,
                            value: 3842
                        },
                        '13': {
                            name: 'Life insurance ? Risiko',
                            frequency: 0,
                            value: 572
                        },

                        length: 14
                    }
                },
                '5': {
                    name: 'Support',
                    elements: {
                        '0': { name: 'PARENTS', frequency: 0, value: 24000 },
                        '1': { name: 'Various', frequency: 0, value: 2000 },

                        length: 2
                    }
                },
                '6': {
                    name: 'Hobby',
                    elements: {
                        '0': { name: 'GOLF', frequency: 0, value: 4000 },
                        '1': { name: 'Greenfee', frequency: 1, value: 2000 },
                        '2': { name: 'Wellness', frequency: 1, value: 500 },
                        '3': { name: 'Various', frequency: 1, value: 500 },
                        '4': { name: 'Gifts', frequency: 1, value: 500 },
                        '5': { name: 'Club', frequency: 1, value: 700 },
                        '6': { name: 'Club', frequency: 1, value: 500 },

                        length: 7
                    }
                },
                '7': {
                    name: 'Taxes',
                    elements: {
                        '0': { name: 'Car 1', frequency: 0, value: 530 },
                        '1': { name: 'Car 2', frequency: 1, value: 690 },
                        '2': { name: 'Camper', frequency: 1, value: 240 },
                        '3': { name: 'Property', frequency: 0, value: 1000 },
                        '4': {
                            name: 'Location 1',
                            frequency: 1,
                            value: 2000
                        },
                        '5': {
                            name: 'State',
                            frequency: 1,
                            value: 2000
                        },
                        '6': { name: 'Location 2', frequency: 0, value: 3000 },
                        '7': { name: 'Location 3', frequency: 0, value: 3000 },

                        length: 8
                    }
                },
                length: 8
            }
        },
        length: 7
    },
    assets: {
        name: '',
        positiv: {
            '0': {
                name: 'Barvermögen',
                elements: {
                    '0': { name: 'Raifeisen MALE', year: 0, value: 20000 },
                    '1': { name: 'Raiffeisen Taxes', year: 0, value: 35000 },
                    '2': {
                        name: 'Raiffeisen FEMALE Zahlungen',
                        year: 0,
                        value: 20000
                    },
                    '3': { name: 'Valliant MALE', year: 0, value: 100000 },
                    '4': {
                        name: 'Allgäu West Volksbank',
                        year: 0,
                        value: 15000
                    },
                    '5': { name: 'LUKB FEMALE Lohn', year: 0, value: 20000 },
                    '6': { name: 'LUKB Privat FEMALE', year: 0, value: 80000 },
                    '7': { name: 'WIR', year: 0, value: 80000 },
                    length: 8
                }
            },
            '1': {
                name: 'Property',
                elements: {
                    '0': {
                        name: "1/2 Location 2    950'000.00",
                        year: 0,
                        value: 450000
                    },
                    '1': {
                        name: "1/2 Saumweg 10  1'300'000.00",
                        year: 0,
                        value: 450000
                    },
                    '2': {
                        name: "Kantonsstr. 30   1'300'000.00",
                        year: 0,
                        value: 800000
                    },
                    '3': {
                        name: "Location 3erboden 3W  1'600'000.00",
                        year: 0,
                        value: 840000
                    },
                    '4': {
                        name: "House 6    600'000.00",
                        year: 0,
                        value: 100
                    },
                    '5': {
                        name: "Dragon 28     200'000.00",
                        year: 0,
                        value: 65000
                    },
                    '6': {
                        name: "Brändiweg 12   1'300'000.00",
                        year: 0,
                        value: 800000
                    },
                    '7': {
                        name: "1/2 Sauna     40'000.00",
                        year: 0,
                        value: 100
                    },
                    length: 8
                }
            },
            '2': {
                name: 'Geldanlage',
                elements: {}
            },
            '3': {
                name: 'Beteiligungen',
                elements: {}
            },
            length: 4
        },
        negativ: {
            '0': {
                name: 'Barkredite',
                elements: {}
            },
            '1': {
                name: 'Hypotheken',
                elements: {
                    '0': {
                        name: '1/2 Rathausstr. 23 2.9%',
                        year: 0,
                        value: 450000
                    },
                    '1': { name: '1/2 Saumweg 3%', year: 0, value: 450000 },
                    '2': {
                        name: "Kantonstr. 30 2.4% 400' 1.2% 200'",
                        year: 0,
                        value: 800000
                    },
                    '3': {
                        name: 'Location 3erboden 3%',
                        year: 0,
                        value: 840000
                    },
                    '4': { name: 'Veltheim 0%', year: 0, value: 100 },
                    '5': { name: 'Dragon 28', year: 0, value: 65000 },
                    '6': { name: 'Brändiweg 12', year: 0, value: 800000 },
                    '7': { name: '1/2 Sauna', year: 0, value: 100 },
                    length: 8
                }
            },
            length: 2
        }
    },
    revenue: {
        name: '',
        positiv: {
            '0': {
                name: 'Altersvorsorge HU',
                elements: {
                    '0': { name: 'Bättig RV', year: 2020, value: 1000000 },
                    '1': { name: 'Swisslife', year: 2019, value: 200000 },
                    '2': {
                        name: 'Life insuranceKader',
                        year: 2020,
                        value: 200000
                    },
                    '3': { name: 'Zürich FEMALE', year: 2021, value: 40000 },
                    '4': { name: 'Life insuranceFEMALE', year: 0, value: 0 },
                    '5': { name: 'Bättig FEMALE', year: 0, value: 0 },
                    length: 6
                }
            },
            length: 1
        },
        negativ: {
            '0': {
                name: 'Auto',
                elements: {}
            },
            '1': {
                name: 'Canaria Umbau',
                elements: {}
            },
            '2': {
                name: 'Various',
                elements: {
                    '0': {
                        name: 'Unvorhergesehenes',
                        year: 2030,
                        value: 20000
                    },
                    '1': { name: 'Wünsche', year: 2020, value: 20000 },
                    length: 2
                }
            },
            length: 3
        }
    },
    development: {
        name: '',
        from: 2016,
        to: 2050,
        elements: {
            '0': { budget: 0, year: 2016 },
            '1': { budget: 1, year: 2020 },
            '2': { budget: 2, year: 2026 },
            '3': { budget: 3, year: 2031 },
            '4': { budget: 4, year: 2036 },
            '5': { budget: 5, year: 2041 },
            '6': { budget: 6, year: 2046 },
            length: 7
        }
    },
    client: {
        city: '',
        comment: '',
        company: 'Company ag',
        eMail: '',
        mobilNumber: '',
        name: 'Burri',
        prename: 'Hans-Ulrich',
        street: '',
        telNumber: '',
        zipCode: ''
    },
    name: 'Budget ab 2016'
};
