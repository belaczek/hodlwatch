import React from 'react'
// @ts-ignore
import { map } from 'lodash/fp'
import { timeframes } from 'store/modules/priceData'
import { Tabs, TabLink, TabList, Tab } from 'bloomer'

export default ({ onChange, activeTf, className = '' }) => (
  <Tabs isAlign="centered" isSize="small" className="is-fullwidth">
    <TabList>
      {map(
        ({ name, id, longName }) => (
          <Tab isActive={id === activeTf}>
            <TabLink onClick={() => onChange(id)}>{name}</TabLink>
          </Tab>
        ),
        timeframes
      )}
    </TabList>
  </Tabs>
)
